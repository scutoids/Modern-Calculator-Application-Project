// 匯入 Angular 的核心模組
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular'; // 匯入 ToastController 用於顯示提示

// 定義 Angular 元件
@Component({
  selector: 'app-app-report',
  templateUrl: './app-report.page.html',
  styleUrls: ['./app-report.page.scss'],
  standalone: false
})
export class AppReportPage implements OnInit {
  // 表單數據，使用雙向數據綁定
  problemTitle: string = ''; // 問題標題
  problem: string = ''; // 問題描述
  problemType: string = 'Calculator'; // 問題類型，預設值設為 'Calculator'

  // 建構函數：注入 ToastController
  constructor(private toastController: ToastController) {}

  // 自訂的 createAjax 函數（假設你已經定義）
  createAjax({ url, method, data, success, error }: {
    url: string;
    method: string;
    data: any;
    success: (response: any) => void;
    error: (err: any) => void;
  }) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          success(JSON.parse(xhr.responseText));
        } else {
          error(xhr.statusText);
        }
      }
    };
    xhr.send(JSON.stringify(data));
  }

  // 提交報告並上傳到伺服器
  async report() {
    // 檢查表單是否為空
    if (!this.problemTitle.trim() && !this.problem.trim()) {
      const toast = await this.toastController.create({
        message: '請至少輸入問題標題或問題描述！',
        duration: 2000,
        position: 'top',
        cssClass: 'custom-toast',
        color: 'danger'
      });
      await toast.present();
      return;
    }

    // 創建報告數據物件
    const data = {
      problemTitle: this.problemTitle,
      problem: this.problem,
      problemType: this.problemType
    };
    console.log('report', data);

    // 使用 createAjax 上傳數據到伺服器
    this.createAjax({
      url: 'http://localhost/server/reportdata.php',
      method: 'POST',
      data: data,
      success: async (response) => {
        if (response.status === 'success') {
          // 顯示成功提示
          const toast = await this.toastController.create({
            message: '報告已成功上傳並保存！',
            duration: 2000,
            position: 'top',
            cssClass: 'custom-toast',
            color: 'success'
          });
          await toast.present();

          // 清空表單
          this.problemTitle = '';
          this.problem = '';
          this.problemType = 'Calculator';
        } else {
          // 顯示伺服器返回的錯誤
          const toast = await this.toastController.create({
            message: '上傳失敗：' + response.message,
            duration: 2000,
            position: 'top',
            cssClass: 'custom-toast',
            color: 'danger'
          });
          await toast.present();
        }
      },
      error: async (err) => {
        // 顯示上傳錯誤
        const toast = await this.toastController.create({
          message: '上傳失敗，請檢查網路連接！',
          duration: 2000,
          position: 'top',
          cssClass: 'custom-toast',
          color: 'danger'
        });
        await toast.present();
        console.error('上傳錯誤:', err);
      }
    });
  }

  ngOnInit() {}
}