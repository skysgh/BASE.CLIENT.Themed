// Rx:
//
// Ag:
import { Injectable, TemplateRef } from '@angular/core';
// Etc:
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
// Models:
//
// Data:
//

// Used by dashboard for example:

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  toasts: any[] = [];

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }

  public show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  public remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
