import { Injectable, TemplateRef } from '@angular/core';
import { DiagnosticsTraceService } from './diagnostics.service';

// Used by dashboard for example:

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }

  public show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  public remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
