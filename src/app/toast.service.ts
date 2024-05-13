import { Injectable } from '@angular/core';
import {MessageService} from "primeng/api";


@Injectable({
  providedIn: 'root',
})

export class ToastService {

  constructor(private messageService: MessageService) {

  }

  pushInfo(message: string, key: string, type: 'error' | 'info' | 'success' | 'warning'): void {
    setTimeout(() => {
      this.messageService.add({
        detail: message,
        key: key,
        severity: type,
        life: (type == "info" || type == "success") ? 2000 : 4000
      });
    }, 2000);
  }
}
