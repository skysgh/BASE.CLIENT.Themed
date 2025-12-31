/**
 * Payment Hub Component
 * 
 * Main dashboard for payment processing applet.
 * Shows subscription status, payment methods, and recent transactions.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { formatAmount, getSubscriptionStatusBadgeClass } from '../../models';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

@Component({
    selector: 'app-payment-hub',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class PaymentHubComponent implements OnInit {

  // Service signals - use getters to avoid initialization order issues
  get paymentMethods() { return this.paymentService.paymentMethods; }
  get transactions() { return this.paymentService.transactions; }
  get subscription() { return this.paymentService.subscription; }
  get loading() { return this.paymentService.loading; }
  get defaultPaymentMethod() { return this.paymentService.defaultPaymentMethod; }
  get hasActiveSubscription() { return this.paymentService.hasActiveSubscription; }

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }

  ngOnInit(): void {
    // Load all data
    this.paymentService.loadPaymentMethods();
    this.paymentService.loadSubscription();
    this.paymentService.loadTransactions();
  }

  // Helpers
  formatPrice = formatAmount;
  getSubStatusClass = getSubscriptionStatusBadgeClass;

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
