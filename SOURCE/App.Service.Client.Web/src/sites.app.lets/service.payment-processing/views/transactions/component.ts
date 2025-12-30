/**
 * Transactions History Component
 * 
 * Displays payment transaction history.
 * Shows both subscription and purchase transactions.
 */
import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { TransactionDto, formatAmount, getStatusBadgeClass } from '../../models';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class TransactionsComponent implements OnInit {

  // Service signals
  transactions = this.paymentService.transactions;
  loading = this.paymentService.loading;
  error = this.paymentService.error;

  constructor(
    private paymentService: PaymentService,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }

  ngOnInit(): void {
    this.paymentService.loadTransactions();
  }

  // Helpers
  formatPrice = formatAmount;
  getStatusClass = getStatusBadgeClass;

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

  /**
   * Get transaction type icon
   */
  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'subscription': 'ri-repeat-line',
      'purchase': 'ri-shopping-cart-line',
      'refund': 'ri-refund-line',
      'adjustment': 'ri-settings-line'
    };
    return icons[type] || 'ri-exchange-line';
  }
}
