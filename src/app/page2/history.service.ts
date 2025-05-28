// 匯入 Angular 的 Injectable 裝飾器，用於定義服務
import { Injectable } from '@angular/core';

// 使用 Injectable 裝飾器，定義服務並設定為根層級提供
@Injectable({
  providedIn: 'root' // 服務在應用程式根層級提供，單例模式
})
export class HistoryService {
  // 私有變數：用於在 localStorage 中儲存歷史記錄的鍵名
  private historyKey = 'calculatorHistory';

  // 新增歷史記錄項目
  addEntry(expression: string, result: number) {
    const history = this.getHistory(); // 從 localStorage 獲取歷史記錄
    const entry = `${expression} = ${result}`; // 創建記錄項，格式為 "表達式 = 結果"
    history.push(entry); // 將記錄項添加到歷史記錄陣列
    localStorage.setItem(this.historyKey, JSON.stringify(history)); // 將更新後的歷史記錄儲存到 localStorage
  }

  // 獲取歷史記錄
  getHistory(): string[] {
    const history = localStorage.getItem(this.historyKey); // 從 localStorage 獲取歷史記錄
    return history ? JSON.parse(history) : []; // 如果存在則解析為陣列，否則返回空陣列
  }

  // 清除歷史記錄
  clearHistory() {
    localStorage.removeItem(this.historyKey); // 從 localStorage 中移除歷史記錄
  }

  // 刪除指定索引的歷史記錄項目
  deleteEntry(index: number) {
    const history = this.getHistory(); // 獲取歷史記錄
    // 檢查索引是否有效（大於 -1 且小於歷史記錄長度）
    if (index > -1 && index < history.length) {
      history.splice(index, 1); // 刪除指定索引的記錄
      localStorage.setItem(this.historyKey, JSON.stringify(history)); // 更新 localStorage
    }
  }

  // 建構函數，無需額外初始化邏輯
  constructor() {}
}
