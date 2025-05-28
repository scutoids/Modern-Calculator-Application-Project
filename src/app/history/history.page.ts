// 匯入 Angular 的核心模組
import { Component, OnInit } from '@angular/core';
// 匯入歷史記錄服務
import { HistoryService } from '../page2/history.service';

// 定義 Angular 元件
@Component({
  selector: 'app-history', // 元件選擇器
  templateUrl: './history.page.html', // 模板檔案
  styleUrls: ['./history.page.scss'], // 樣式檔案
  standalone: false // 非獨立元件
})
export class HistoryPage implements OnInit {
  // 儲存歷史記錄的陣列
  history: string[] = [];

  // 建構函數：注入 HistoryService 並載入歷史記錄
  constructor(private historyService: HistoryService) {
    this.loadHistory(); // 初始化時載入歷史記錄
  }

  // 載入歷史記錄
  loadHistory() {
    this.history = this.historyService.getHistory(); // 從 HistoryService 獲取歷史記錄
  }

  // 清除歷史記錄
  clearHistory() {
    this.historyService.clearHistory(); // 呼叫服務清除歷史記錄
    this.loadHistory(); // 重新載入歷史記錄（更新為空）
  }

  ngOnInit() {
  }
}
