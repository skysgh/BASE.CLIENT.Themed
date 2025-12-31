/**
 * Refund Component
 * 
 * PHILOSOPHY: Refund First
 * - Make refunds the easiest action possible
 * - No questions asked
 * - Over-give-back (refund to start of billing period, not prorated)
 * - Zero friction = trust = future business
 * 
 * Route: /system/billing/refund
 */
import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
import { formatAmount } from '../../models';

interface RefundState {
  step: 'confirm' | 'processing' | 'complete' | 'error';
  refundAmount: number;
  refundDate: string;
  errorMessage?: string;
}

@Component({
  selector: 'app-refund',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class RefundComponent implements OnInit {

  // State
  state = signal<RefundState>({
    step: 'confirm',
    refundAmount: 0,
    refundDate: new Date().toISOString()
  });

  // Service data
  get subscription() { return this.paymentService.subscription; }
  get hasActiveSubscription() { return this.paymentService.hasActiveSubscription; }
  get loading() { return this.paymentService.loading; }

  // Computed values
  refundAmountFormatted = computed(() => {
    const sub = this.subscription();
    if (!sub) return '$0.00';
    return formatAmount(sub.amountCents, sub.currency);
  });

  billingPeriodStart = computed(() => {
    const sub = this.subscription();
    if (!sub) return '';
    return new Date(sub.currentPeriodStart).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }

  ngOnInit(): void {
    this.paymentService.loadSubscription();
  }

  /**
   * Process refund - No questions asked
   */
  async processRefund(): Promise<void> {
    this.state.update(s => ({ ...s, step: 'processing' }));

    try {
      // TODO: Call actual refund API via PaymentService
      // For now, simulate the process
      await this.simulateRefundProcess();

      const sub = this.subscription();
      this.state.update(s => ({
        ...s,
        step: 'complete',
        refundAmount: sub?.amountCents || 0,
        refundDate: new Date().toISOString()
      }));

    } catch (error: any) {
      this.state.update(s => ({
        ...s,
        step: 'error',
        errorMessage: error.message || 'An error occurred processing your refund.'
      }));
    }
  }

  /**
   * Simulate refund process (replace with real API call)
   */
  private simulateRefundProcess(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  /**
   * Go back to billing hub
   */
  goToHub(): void {
    this.router.navigate(['/apps/system/billing/hub']);
  }

  /**
   * Retry after error
   */
  retry(): void {
    this.state.update(s => ({ ...s, step: 'confirm', errorMessage: undefined }));
  }

  /**
   * Format currency
   */
  formatPrice = formatAmount;
}
