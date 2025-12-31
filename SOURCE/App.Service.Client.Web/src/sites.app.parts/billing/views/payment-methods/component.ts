/**
 * Payment Methods Management Component
 * 
 * Allows users to view, add, and manage their saved payment methods.
 * Reused by both subscription and checkout flows.
 */
import { Component, OnInit, computed } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../services/payment.service';
import { PaymentMethodDto, getCardBrandIcon, formatExpiry } from '../../models';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

@Component({
    selector: 'app-payment-methods',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class PaymentMethodsComponent implements OnInit {

  // Expose service signals - use getters to avoid initialization order issues
  get paymentMethods() { return this.paymentService.paymentMethods; }
  get loading() { return this.paymentService.loading; }
  get error() { return this.paymentService.error; }

  // Form state for add modal
  showAddForm = false;
  newCard = {
    holderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  };
  formError = '';
  formSubmitting = false;

  constructor(
    private paymentService: PaymentService,
    private modalService: NgbModal,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }

  ngOnInit(): void {
    this.paymentService.loadPaymentMethods();
  }

  // Helpers exposed to template
  getCardIcon = getCardBrandIcon;
  formatExp = formatExpiry;

  /**
   * Open add payment method form
   */
  openAddForm(): void {
    this.showAddForm = true;
    this.resetForm();
  }

  /**
   * Close add payment method form
   */
  closeAddForm(): void {
    this.showAddForm = false;
    this.resetForm();
  }

  /**
   * Reset the form
   */
  private resetForm(): void {
    this.newCard = {
      holderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false
    };
    this.formError = '';
  }

  /**
   * Submit new payment method
   */
  submitNewCard(): void {
    this.formError = '';

    // Basic validation
    if (!this.newCard.holderName || !this.newCard.cardNumber || 
        !this.newCard.expiryMonth || !this.newCard.expiryYear || !this.newCard.cvv) {
      this.formError = 'Please fill in all required fields';
      return;
    }

    if (this.newCard.cardNumber.length < 13) {
      this.formError = 'Invalid card number';
      return;
    }

    this.formSubmitting = true;

    this.paymentService.addPaymentMethod({
      type: 'credit_card',
      holderName: this.newCard.holderName,
      cardNumber: this.newCard.cardNumber.replace(/\s/g, ''),
      expiryMonth: parseInt(this.newCard.expiryMonth),
      expiryYear: parseInt(this.newCard.expiryYear),
      cvv: this.newCard.cvv,
      isDefault: this.newCard.isDefault
    }).subscribe({
      next: () => {
        this.formSubmitting = false;
        this.closeAddForm();
      },
      error: (err) => {
        this.formError = 'Failed to add payment method';
        this.formSubmitting = false;
      }
    });
  }

  /**
   * Remove a payment method
   */
  removeMethod(id: string): void {
    if (confirm('Are you sure you want to remove this payment method?')) {
      this.paymentService.removePaymentMethod(id).subscribe();
    }
  }

  /**
   * Set as default
   */
  setDefault(id: string): void {
    this.paymentService.setDefaultPaymentMethod(id).subscribe();
  }

  /**
   * Format card number for display (masking)
   */
  maskCardNumber(cardNumber: string): string {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.length < 4) return cardNumber;
    return `•••• •••• •••• ${clean.slice(-4)}`;
  }
}
