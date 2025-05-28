// 匯入 Angular 的核心模組和相關服務
import { Component, OnInit } from '@angular/core';
import { create, evaluate } from 'mathjs'; // 匯入 mathjs 用於數學運算
import { Router } from '@angular/router'; // 匯入 Router 用於頁面導航
import { HistoryService } from '../page2/history.service'; // 匯入歷史記錄服務
import { AlertController, IonButton, NavController, ToastController, ModalController } from '@ionic/angular/standalone'; // 匯入 Ionic 元件
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; // 匯入 HTTP 客戶端

// 定義 Angular 元件
@Component({
  selector: 'app-page2', // 元件選擇器
  templateUrl: './page2.page.html', // 模板檔案
  styleUrls: ['./page2.page.scss'], // 樣式檔案
  standalone: false, // 非獨立元件
})
export class Page2Page implements OnInit {
  // 私有變數：顯示當前輸入或結果
  display: string = '';
  // 私有變數：儲存上一次計算結果
  private lastResult: string = '';
  // 控制是否顯示進階模式的布林值
  isAdvanced: boolean = false;
  // 私有變數：儲存記憶體數值
  private memory: number = 0;

  // 處理按鈕點擊事件
  onButtonClick(value: string) {
    if (value === '^2' || value === '^3') {
      // 平方或立方：直接附加到顯示內容
      this.display += value;
    } else if (value === '=') {
      // 等於：執行計算
      this.calculate();
    } else if (value === 'C') {
      // 清空：清除顯示內容
      this.display = '';
    } else if (value === 'Ans') {
      // 顯示上一次結果
      this.display += this.lastResult;
    } else if (value === 'Back') {
      // 退格：刪除最後一個字符
      this.display = this.display.slice(0, -1);
    } else if (value === '%') {
      // 百分比：附加到顯示內容
      this.display += value;
    } else {
      // 其他按鈕：附加到顯示內容
      this.display += value;
    }
  }

  // 記憶體加法：將當前結果加到記憶體
  memoryAdd() {
    try {
      const result = evaluate(this.display); // 計算顯示內容
      this.memory += result; // 加到記憶體
      this.display = ''; // 清空顯示
      console.log('Memory:', this.memory);
    } catch (e) {
      this.display = 'Error'; // 錯誤時顯示 Error
    }
  }

  // 記憶體讀取：將記憶體值附加到顯示內容
  memoryRecall() {
    this.display += this.memory.toString();
    console.log('Memory recalled:', this.memory);
  }

  // 記憶體清除：將記憶體清零
  memoryClear() {
    this.memory = 0;
    console.log('Memory cleared.');
  }

  // 切換佈局：基本模式與進階模式之間切換
  switchLayout() {
    this.isAdvanced = !this.isAdvanced;
  }

  // 計算：處理等於按鈕的邏輯
  private calculate() {
    try {
      const result = evaluate(this.display); // 計算顯示內容
      this.historyService.addEntry(this.display, result); // 儲存到歷史記錄
      this.display = result.toString(); // 顯示結果
      this.lastResult = this.display; // 更新上一次結果
    } catch (e) {
      this.display = 'Error'; // 錯誤時顯示 Error
    }
  }

  // 導航到 page3 頁面
  page3() {
    this.router.navigate(['page3']);
  }

  // 導航到 AI 頁面
  aipage() {
    this.router.navigate(['aipage']);
  }

  // 導航到 3D 數學頁面
  math() {
    this.router.navigate(['math3-d']);
  }

  // 顯示提示彈窗
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Notice', // 標題
      subHeader: 'Incomplete', // 副標題
      message: 'The function Exchange Rate converter is not complete Please wait for the next update', // 訊息
      buttons: ['OK'], // 按鈕
    });
    await alert.present(); // 顯示彈窗
  }

  // 發送 AJAX 請求
  async createAjax(url: string, method: string, data: any) {
    try {
      const response = await fetch(url, {
        method, // HTTP 方法
        headers: {
          'Content-Type': 'application/json', // 設定內容類型
        },
        body: JSON.stringify(data), // 將資料轉為 JSON
      });
      return await response.json(); // 回傳 JSON 結果
    } catch (error) {
      console.error('Fetch error:', error); // 錯誤處理
      return null;
    }
  }

  // 建構函數：注入依賴服務
  constructor(
    public router: Router, // 路由服務
    private historyService: HistoryService, // 歷史記錄服務
    private alertController: AlertController, // 彈窗控制器
    private http: HttpClient, // HTTP 客戶端
    public navController: NavController // 導航控制器
  ) {}

  // 元件初始化時執行的生命週期鉤子
  ngOnInit() {}
}