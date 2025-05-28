from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import LabelEncoder
import logging
import os

app = Flask(__name__)

# 設置日誌
logging.basicConfig(
    filename='flask_api.log',
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s: %(message)s'
)

# 錯誤訊息
error_messages = {
    "zh-TW": {
        "missing_columns": "CSV 檔案缺少必要欄位：年與季, 區域, 總計",
        "no_all_regions": "CSV 檔案中沒有 '所有區域' 的數據！",
        "parse_year_quarter_error": "無法解析「年與季」欄位：{error}",
        "data_empty_after_filter": "過濾異常年份後，數據為空！",
        "invalid_file_type": "請上傳 CSV 檔案！",
        "file_process_error": "處理檔案時發生錯誤：{error}",
        "file_not_found": "檔案不存在：{filename}"
    }
}

# 處理數據集的函數
def process_dataset(dataframe):
    try:
        # 檢查必要欄位
        required_columns = ['年與季', '區域', '總計']
        if not all(col in dataframe.columns for col in required_columns):
            return False, error_messages["zh-TW"]["missing_columns"]

        # 過濾出「所有區域」的數據
        df = dataframe[dataframe['區域'] == '所有區域'].copy()
        if df.empty:
            return False, error_messages["zh-TW"]["no_all_regions"]

        # 拆分「年與季」為「Year」和「Quarter」
        try:
            df[['Year', 'Quarter']] = df['年與季'].str.split('-', expand=True)
            df['Year'] = pd.to_numeric(df['Year'], errors='coerce')
            df['Quarter'] = pd.to_numeric(df['Quarter'], errors='coerce')
        except Exception as e:
            return False, error_messages["zh-TW"]["parse_year_quarter_error"].format(error=str(e))

        # 過濾異常年份（例如大於 2023）
        df = df[df['Year'] <= 2023]
        if df.empty:
            return False, error_messages["zh-TW"]["data_empty_after_filter"]

        # 將「總計」映射為「Freight_Tonnage」
        df['Freight_Tonnage'] = df['總計']

        # 數據預處理
        logging.info("檢查缺失值：\n%s", df.isnull().sum())
        df['Freight_Tonnage'] = df['Freight_Tonnage'].fillna(df['Freight_Tonnage'].mean())

        # 移除異常值（使用 IQR 方法）
        Q1 = df['Freight_Tonnage'].quantile(0.25)
        Q3 = df['Freight_Tonnage'].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        df['Freight_Tonnage'] = df['Freight_Tonnage'].clip(lower=lower_bound, upper=upper_bound)

        # 特徵工程
        le = LabelEncoder()
        df['Quarter_Encoded'] = le.fit_transform(df['Quarter'])
        df['Time'] = df['Year'] + (df['Quarter_Encoded'] + 1) / 4

        # 準備特徵和目標
        features = ['Time', 'Quarter_Encoded']
        X = df[features]
        y = df['Freight_Tonnage']

        # 計算滾動平均
        df['Rolling_Mean'] = df['Freight_Tonnage'].rolling(window=4).mean().fillna(method='bfill')
        X['Rolling_Mean'] = df['Rolling_Mean']

        # 訓練模型
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = LinearRegression()
        model.fit(X_train, y_train)

        # 評估模型
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        logging.info(f"模型均方誤差 (MSE)：{mse:.2f}")

        # 返回詳細摘要
        summary = f"數據處理成功！模型均方誤差：{mse:.2f}\n"
        summary += f"數據行數：{len(df)}\n"
        summary += f"年份範圍：{df['Year'].min()} - {df['Year'].max()}\n"
        summary += f"平均貨運噸位：{df['Freight_Tonnage'].mean():.2f}"

        return True, {
            'summary': summary,
            'columns': df.columns.tolist()
        }

    except Exception as e:
        logging.error(f"處理數據時發生錯誤：{str(e)}")
        return False, error_messages["zh-TW"]["file_process_error"].format(error=str(e))

@app.route('/summarize', methods=['POST'])
def summarize():
    lang = request.args.get('lang', 'zh-TW')
    data = request.get_json()
    if not data or 'filename' not in data:
        logging.warning("缺少檔案名稱")
        return jsonify({'error': '缺少檔案名稱'}), 400

    filename = data['filename']
    logging.info(f"收到文件路徑: {filename}")
    
    if not os.path.exists(filename):
        logging.warning(f"檔案不存在：{filename}")
        return jsonify({'error': error_messages[lang]["file_not_found"].format(filename=filename)}), 400

    try:
        # 讀取 CSV
        df = pd.read_csv(filename)
        logging.info(f"已讀取 CSV 檔案，行數：{len(df)}")

        # 處理數據
        success, result = process_dataset(df)

        if not success:
            logging.warning(f"數據處理失敗：{result}")
            return jsonify({'error': result}), 400

        logging.info("數據處理成功")
        return jsonify({
            'status': 'success',
            'summary': result['summary'],
            'columns': result['columns']
        })

    except Exception as e:
        logging.error(f"處理檔案時發生錯誤：{str(e)}")
        return jsonify({'error': error_messages[lang]["file_process_error"].format(error=str(e))}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)