// 匯入 Angular 的核心模組
import { Component, OnInit, AfterViewInit } from '@angular/core';

// 聲明外部 GeoGebra 的 GGBApplet 物件，供程式碼使用
declare var GGBApplet: any;

// 定義 Angular 元件
@Component({
  selector: 'app-math3-d', // 元件選擇器
  templateUrl: './math3-d.page.html', // 模板檔案
  styleUrls: ['./math3-d.page.scss'], // 樣式檔案
  standalone: false // 非獨立元件
})
export class Math3DPage implements OnInit, AfterViewInit {
  // 建構函數，無需額外初始化邏輯
  constructor() {}

  // 定義 GeoGebra 應用程式變數
  ggbApp: any;

  // 元件初始化時執行的生命週期鉤子
  ngOnInit() {
    // 可在此處添加額外的初始化邏輯（目前為空）
  }

  // 視圖初始化完成後執行的生命週期鉤子
  ngAfterViewInit() {
    // 初始化 GeoGebra 應用程式
    this.ggbApp = new GGBApplet({
      appName: 'graphing', // 應用程式類型：繪圖模式
      width: 480, // 畫布寬度
      height: 1000, // 畫布高度
      showToolbar: true, // 顯示工具列
      showAlgebraInput: true, // 顯示代數輸入框
      showMenuBar: true, // 顯示選單列
      language: 'zh_TW' // 設置介面語言為繁體中文
    }, true);

    // 將 GeoGebra 應用程式注入到 HTML 中 ID 為 'ggb-element' 的元素
    this.ggbApp.inject('ggb-element');
  }
}