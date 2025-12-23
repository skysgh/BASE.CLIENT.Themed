// Rx:
//
// Ag:
import { Injectable, TemplateRef } from '@angular/core';
// Etc:
// Constants:
//
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SystemDefaultServices } from './system.default-services.service';
// Models:
//
// Data:
//

// Used by dashboard for example:

@Injectable({ providedIn: 'root' })
export class ToastService {


  toasts: any[] = [];

  constructor(private defaultServices: SystemDefaultServices) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }

  public show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  public remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
