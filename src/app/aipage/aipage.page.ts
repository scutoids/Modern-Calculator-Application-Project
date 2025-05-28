import { Component, ViewChild, OnInit } from '@angular/core';
import { IonContent, IonSelect } from '@ionic/angular';
import { ApiService } from './api.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-aipage',
  templateUrl: './aipage.page.html',
  styleUrls: ['./aipage.page.scss'],
  standalone: false
})
export class AIpagePage implements OnInit {
  @ViewChild(IonContent) content: IonContent | undefined;
  @ViewChild('modeSelect') modeSelect: IonSelect | undefined;

  messageInput: string = '';
  messages: { role: string; content: string }[] = [];
  isLoading: boolean = false;
  selectedMode: string = 'basic_math';
  availableModes: { value: string; label: string }[] = [
    { value: 'basic_math', label: '基本數學' },
    { value: 'applied_math', label: '應用問題' },
    { value: 'data_processing', label: '數據處理' },
  ];

  constructor(private apiservice: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // 初始化歡迎訊息
    this.messages.push({
      role: 'assistant',
      content: '你好！',
    });
    this.messages.push({
      role: 'assistant',
      content: '今天我能幫你解決什麼數學問題？試試計算題或應用題！',
    });
    this.cdr.detectChanges();
  }

  onInputChange() {
    this.cdr.detectChanges();
  }

  onSendMessage() {
    if (!this.messageInput.trim() || this.isLoading) return;

    const message = this.messageInput.trim();
    console.log('調用 sendMessage，問題:', message, '模式:', this.selectedMode);
    this.messages.push({ role: 'user', content: message });
    this.isLoading = true;
    this.messageInput = '';

    setTimeout(() => this.content?.scrollToBottom(300), 100);

    this.apiservice.sendMessage(message).subscribe({
      next: (response) => {
        this.isLoading = false;
        const reply = response?.choices?.[0]?.message?.content || '無有效回應';
        console.log('收到回應:', reply);
        this.messages.push({ role: 'assistant', content: reply });
        setTimeout(() => this.content?.scrollToBottom(300), 100);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || err.message || '未知錯誤';
        console.error('數學問題請求錯誤:', err);
        this.messages.push({
          role: 'assistant',
          content: `無法處理您的問題，請檢查輸入或稍後再試。錯誤: ${errorMessage}`,
        });
        setTimeout(() => this.content?.scrollToBottom(300), 100);
        this.cdr.detectChanges();
      },
    });
  }

  onFileSelected(event: Event) {
    if (this.selectedMode !== 'data_processing' || this.isLoading) return;

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.log('未選擇文件');
      this.messages.push({
        role: 'assistant',
        content: '請選擇一個 CSV 文件。',
      });
      this.cdr.detectChanges();
      return;
    }

    const file = input.files[0];
    if (!file.name.toLowerCase().endsWith('.csv')) {
      console.log('無效文件類型:', file.name);
      this.messages.push({
        role: 'assistant',
        content: '請上傳 CSV 文件。',
      });
      this.cdr.detectChanges();
      return;
    }

    const formData = new FormData();
    formData.append('data_csv', file);
    this.isLoading = true;
    console.log('上傳文件:', file.name);

    this.messages.push({
      role: 'user',
      content: `上傳文件: ${file.name}`,
    });
    setTimeout(() => this.content?.scrollToBottom(300), 100);

    this.apiservice.uploadFile(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        const reply = response?.choices?.[0]?.message?.content || '無有效回應';
        console.log('文件上傳回應:', reply);
        this.messages.push({ role: 'assistant', content: reply });
        setTimeout(() => this.content?.scrollToBottom(300), 100);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || err.message || '未知錯誤';
        console.error('文件上傳錯誤:', err);
        this.messages.push({
          role: 'assistant',
          content: `文件上傳失敗: ${errorMessage}`,
        });
        setTimeout(() => this.content?.scrollToBottom(300), 100);
        this.cdr.detectChanges();
      },
    });

    input.value = '';
  }

  onClearChat() {
    this.messages = [];
    // 重新添加歡迎訊息
    this.messages.push({
      role: 'assistant',
      content: '你好！',
    });
    this.messages.push({
      role: 'assistant',
      content: '今天我能幫你解決什麼數學問題？試試計算題或應用題！',
    });
    this.messageInput = '';
    this.cdr.detectChanges();
  }

  onModeChange() {
    console.log('模式變更:', this.selectedMode);
    this.messages = [];
    // 重新添加歡迎訊息
    this.messages.push({
      role: 'assistant',
      content: '你好！',
    });
    this.messages.push({
      role: 'assistant',
      content: '今天我能幫你解決什麼數學問題？試試計算題或應用題！',
    });
    this.messageInput = '';
    this.cdr.detectChanges();
  }
}