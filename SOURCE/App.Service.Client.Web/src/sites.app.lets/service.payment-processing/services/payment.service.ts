/**
 * Payment Service
 * 
 * Handles payment processing operations:
 * - Payment methods CRUD
 * - Subscriptions
 * - Transactions
 * 
 * In production, this would integrate with a payment provider (Stripe, PayPal, etc.)
 * For now, uses mock data for development.
 */
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { 
  PaymentMethodDto, 
  CreatePaymentMethodRequest,
  TransactionDto,
  SubscriptionDto,
  CreateSubscriptionRequest
} from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  
  // ============================================
  // Signals (Reactive State)
  // ============================================
  
  private _paymentMethods = signal<PaymentMethodDto[]>([]);
  private _transactions = signal<TransactionDto[]>([]);
  private _subscription = signal<SubscriptionDto | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly paymentMethods = this._paymentMethods.asReadonly();
  readonly transactions = this._transactions.asReadonly();
  readonly subscription = this._subscription.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed
  readonly defaultPaymentMethod = computed(() => 
    this._paymentMethods().find(pm => pm.isDefault) || null
  );

  readonly hasActiveSubscription = computed(() => {
    const sub = this._subscription();
    return sub?.status === 'active' || sub?.status === 'trialing';
  });

  constructor(
    private http: HttpClient,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }

  // ============================================
  // Payment Methods
  // ============================================

  /**
   * Load saved payment methods for current user
   */
  loadPaymentMethods(): void {
    this._loading.set(true);
    this._error.set(null);

    // Mock data for development
    const mockMethods: PaymentMethodDto[] = [
      {
        id: 'pm_001',
        type: 'credit_card',
        brand: 'visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2025,
        holderName: 'John Doe',
        isDefault: true,
        createdUtc: new Date().toISOString(),
        modifiedUtc: new Date().toISOString()
      },
      {
        id: 'pm_002',
        type: 'credit_card',
        brand: 'mastercard',
        last4: '8888',
        expiryMonth: 6,
        expiryYear: 2026,
        holderName: 'John Doe',
        isDefault: false,
        createdUtc: new Date().toISOString(),
        modifiedUtc: new Date().toISOString()
      }
    ];

    // Simulate API delay
    of(mockMethods).pipe(
      delay(500),
      tap(() => this._loading.set(false))
    ).subscribe({
      next: (methods) => this._paymentMethods.set(methods),
      error: (err) => {
        this._error.set('Failed to load payment methods');
        this._loading.set(false);
      }
    });
  }

  /**
   * Add a new payment method
   */
  addPaymentMethod(request: CreatePaymentMethodRequest): Observable<PaymentMethodDto> {
    this._loading.set(true);
    this.diagnostics.info(`Adding payment method: ${request.type}`);

    // In production: POST to payment provider API
    // For now, mock the response
    const newMethod: PaymentMethodDto = {
      id: `pm_${Date.now()}`,
      type: request.type,
      brand: 'visa', // Would be detected from card number
      last4: request.cardNumber?.slice(-4) || '0000',
      expiryMonth: request.expiryMonth,
      expiryYear: request.expiryYear,
      holderName: request.holderName,
      isDefault: request.isDefault || false,
      billingAddress: request.billingAddress,
      createdUtc: new Date().toISOString(),
      modifiedUtc: new Date().toISOString()
    };

    return of(newMethod).pipe(
      delay(800),
      tap((method) => {
        const current = this._paymentMethods();
        if (method.isDefault) {
          // Unset other defaults
          current.forEach(pm => pm.isDefault = false);
        }
        this._paymentMethods.set([...current, method]);
        this._loading.set(false);
      })
    );
  }

  /**
   * Remove a payment method
   */
  removePaymentMethod(id: string): Observable<void> {
    this._loading.set(true);
    
    return of(undefined).pipe(
      delay(500),
      tap(() => {
        const updated = this._paymentMethods().filter(pm => pm.id !== id);
        this._paymentMethods.set(updated);
        this._loading.set(false);
      })
    );
  }

  /**
   * Set default payment method
   */
  setDefaultPaymentMethod(id: string): Observable<void> {
    return of(undefined).pipe(
      delay(300),
      tap(() => {
        const updated = this._paymentMethods().map(pm => ({
          ...pm,
          isDefault: pm.id === id
        }));
        this._paymentMethods.set(updated);
      })
    );
  }

  // ============================================
  // Subscriptions
  // ============================================

  /**
   * Load current subscription
   */
  loadSubscription(): void {
    this._loading.set(true);

    // Mock subscription
    const mockSub: SubscriptionDto = {
      id: 'sub_001',
      status: 'active',
      planId: 'plan_pro',
      planName: 'Pro Plan',
      interval: 'monthly',
      amountCents: 2999,
      currency: 'USD',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      createdUtc: new Date().toISOString(),
      modifiedUtc: new Date().toISOString()
    };

    of(mockSub).pipe(
      delay(500),
      tap(() => this._loading.set(false))
    ).subscribe({
      next: (sub) => this._subscription.set(sub),
      error: () => this._loading.set(false)
    });
  }

  /**
   * Create a new subscription
   */
  createSubscription(request: CreateSubscriptionRequest): Observable<SubscriptionDto> {
    this._loading.set(true);
    this.diagnostics.info(`Creating subscription for plan: ${request.planId}`);

    const newSub: SubscriptionDto = {
      id: `sub_${Date.now()}`,
      status: 'active',
      planId: request.planId,
      planName: 'Selected Plan', // Would come from plan lookup
      interval: 'monthly',
      amountCents: 2999,
      currency: 'USD',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      defaultPaymentMethodId: request.paymentMethodId,
      createdUtc: new Date().toISOString(),
      modifiedUtc: new Date().toISOString()
    };

    return of(newSub).pipe(
      delay(1000),
      tap((sub) => {
        this._subscription.set(sub);
        this._loading.set(false);
      })
    );
  }

  /**
   * Cancel subscription
   */
  cancelSubscription(atPeriodEnd: boolean = true): Observable<void> {
    return of(undefined).pipe(
      delay(500),
      tap(() => {
        const current = this._subscription();
        if (current) {
          this._subscription.set({
            ...current,
            cancelAtPeriodEnd: atPeriodEnd,
            status: atPeriodEnd ? current.status : 'cancelled'
          });
        }
      })
    );
  }

  // ============================================
  // Transactions
  // ============================================

  /**
   * Load transaction history
   */
  loadTransactions(): void {
    this._loading.set(true);

    const mockTransactions: TransactionDto[] = [
      {
        id: 'txn_001',
        type: 'subscription',
        status: 'completed',
        amountCents: 2999,
        currency: 'USD',
        description: 'Pro Plan - Monthly',
        paymentMethodLast4: '4242',
        createdUtc: new Date().toISOString(),
        modifiedUtc: new Date().toISOString()
      },
      {
        id: 'txn_002',
        type: 'subscription',
        status: 'completed',
        amountCents: 2999,
        currency: 'USD',
        description: 'Pro Plan - Monthly',
        paymentMethodLast4: '4242',
        createdUtc: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        modifiedUtc: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    of(mockTransactions).pipe(
      delay(500),
      tap(() => this._loading.set(false))
    ).subscribe({
      next: (txns) => this._transactions.set(txns),
      error: () => this._loading.set(false)
    });
  }

  // ============================================
  // One-time Payments (Checkout)
  // ============================================

  /**
   * Process a one-time payment (for cart checkout)
   */
  processPayment(
    paymentMethodId: string, 
    amountCents: number, 
    description: string
  ): Observable<TransactionDto> {
    this._loading.set(true);
    this.diagnostics.info(`Processing payment: ${amountCents} cents`);

    const transaction: TransactionDto = {
      id: `txn_${Date.now()}`,
      type: 'purchase',
      status: 'completed',
      amountCents,
      currency: 'USD',
      description,
      paymentMethodId,
      paymentMethodLast4: this._paymentMethods().find(pm => pm.id === paymentMethodId)?.last4 || '****',
      createdUtc: new Date().toISOString(),
      modifiedUtc: new Date().toISOString()
    };

    return of(transaction).pipe(
      delay(1500), // Simulate processing time
      tap((txn) => {
        this._transactions.set([txn, ...this._transactions()]);
        this._loading.set(false);
      })
    );
  }
}
