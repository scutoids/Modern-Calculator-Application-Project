import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  // 建構函數，注入 Router 服務並設為公開屬性，以便在類別中使用 
  constructor(public router:Router) {}

  page2 (){ // 定義一個名為 page2 的方法，用於導航到 page2 頁面
    this.router.navigate(['page2']);
  }

}
