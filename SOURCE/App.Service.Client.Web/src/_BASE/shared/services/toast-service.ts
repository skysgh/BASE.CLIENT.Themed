import { Injectable, TemplateRef } from '@angular/core';

// Used by dashboard for example:

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  public show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  public remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
