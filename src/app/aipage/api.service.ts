import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private phpApiUrl = 'http://localhost/server/server.php?action=ask_ai';
  private uploadApiUrl = 'http://localhost/server/server.php';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = { message: message.trim() };
    console.log('發送數學問題:', { url: this.phpApiUrl, body }); // 增強日誌
    return this.http.post(this.phpApiUrl, body, { headers });
  }

  uploadFile(formData: FormData): Observable<any> {
    console.log('發送文件上傳:', { url: this.uploadApiUrl }); // 添加日誌
    return this.http.post(this.uploadApiUrl, formData);
  }
}

