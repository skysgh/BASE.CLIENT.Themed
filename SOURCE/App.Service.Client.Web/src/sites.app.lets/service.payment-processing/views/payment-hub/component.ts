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
  styleUrls: ['./component.scss']
})
export class PaymentHubComponent implements OnInit {

  // Service signals
  paymentMethods = this.paymentService.paymentMethods;
  transactions = this.paymentService.transactions;
  subscription = this.paymentService.subscription;
  loading = this.paymentService.loading;
  defaultPaymentMethod = this.paymentService.defaultPaymentMethod;
  hasActiveSubscription = this.paymentService.hasActiveSubscription;

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
