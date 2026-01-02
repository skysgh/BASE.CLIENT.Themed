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

/**
 * Toast variant types
 */
export type ToastVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Toast options
 */
export interface ToastOptions {
  /** CSS class for styling */
  classname?: string;
  
  /** Delay in ms before auto-hide (default: 5000) */
  delay?: number;
  
  /** Icon class to show */
  icon?: string;
  
  /** Toast header/title */
  header?: string;
}

/**
 * Toast Service
 * 
 * Provides non-blocking feedback to users via toast notifications.
 * 
 * Usage:
 * ```typescript
 * // Simple
 * this.toastService.showSuccess('3 items approved');
 * 
 * // With options
 * this.toastService.showInfo('Processing...', { delay: 10000 });
 * 
 * // For batch actions
 * this.toastService.showBatchSuccess('approve', 3);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  constructor(private defaultServices: SystemDefaultServices) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }

  /**
   * Show a generic toast
   */
  public show(textOrTpl: string | TemplateRef<any>, options: ToastOptions = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  /**
   * Remove a toast from the stack
   */
  public remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
  
  // ─────────────────────────────────────────────────────────────
  // Convenience Methods
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Show a success toast
   */
  public showSuccess(message: string, options: ToastOptions = {}) {
    this.show(message, {
      classname: 'bg-success text-white',
      delay: 5000,
      icon: 'bx bx-check-circle',
      ...options,
    });
  }
  
  /**
   * Show an error toast
   */
  public showError(message: string, options: ToastOptions = {}) {
    this.show(message, {
      classname: 'bg-danger text-white',
      delay: 8000,
      icon: 'bx bx-error-circle',
      ...options,
    });
  }
  
  /**
   * Show a warning toast
   */
  public showWarning(message: string, options: ToastOptions = {}) {
    this.show(message, {
      classname: 'bg-warning text-dark',
      delay: 6000,
      icon: 'bx bx-error',
      ...options,
    });
  }
  
  /**
   * Show an info toast
   */
  public showInfo(message: string, options: ToastOptions = {}) {
    this.show(message, {
      classname: 'bg-info text-white',
      delay: 5000,
      icon: 'bx bx-info-circle',
      ...options,
    });
  }
  
  // ─────────────────────────────────────────────────────────────
  // Batch Action Feedback
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Show success feedback for a batch action
   * 
   * @param action The action that was performed (e.g., 'approve', 'delete')
   * @param count Number of items affected
   */
  public showBatchSuccess(action: string, count: number) {
    const plural = count === 1 ? 'item' : 'items';
    const pastTense = this.getPastTense(action);
    this.showSuccess(`${count} ${plural} ${pastTense}`);
  }
  
  /**
   * Show error feedback for a batch action
   */
  public showBatchError(action: string, count: number, error?: string) {
    const plural = count === 1 ? 'item' : 'items';
    const message = error 
      ? `Failed to ${action} ${count} ${plural}: ${error}`
      : `Failed to ${action} ${count} ${plural}`;
    this.showError(message);
  }
  
  /**
   * Convert action verb to past tense (simple version)
   */
  private getPastTense(action: string): string {
    // Common irregular verbs
    const irregulars: Record<string, string> = {
      'delete': 'deleted',
      'send': 'sent',
      'run': 'ran',
      'do': 'done',
    };
    
    const lower = action.toLowerCase();
    if (irregulars[lower]) return irregulars[lower];
    
    // Simple rules
    if (lower.endsWith('e')) return lower + 'd';
    if (lower.endsWith('y') && !/[aeiou]y$/i.test(lower)) {
      return lower.slice(0, -1) + 'ied';
    }
    
    return lower + 'ed';
  }
}
