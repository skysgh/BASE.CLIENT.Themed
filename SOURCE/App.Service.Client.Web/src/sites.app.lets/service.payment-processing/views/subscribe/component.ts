/**
 * Subscribe Component
 * 
 * Subscription flow: Select plan → Enter payment → Confirm subscription
 * Used when a user wants to subscribe to the service.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { formatAmount } from '../../models';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  features: string[];
  isPopular?: boolean;
}

@Component({
  selector: 'app-subscribe',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SubscribeComponent implements OnInit {

  // State
  currentStep: 'select-plan' | 'payment' | 'confirm' | 'success' = 'select-plan';
  billingInterval: 'monthly' | 'yearly' = 'monthly';
  selectedPlan: PricingPlan | null = null;
  selectedPaymentMethodId: string | null = null;
  processing = false;
  error = '';

  // Service signals
  paymentMethods = this.paymentService.paymentMethods;
  subscription = this.paymentService.subscription;
  loading = this.paymentService.loading;

  // Pricing plans (would come from API in production)
  plans: PricingPlan[] = [
    {
      id: 'plan_starter',
      name: 'Starter',
      description: 'For individuals getting started',
      monthlyPriceCents: 999,
      yearlyPriceCents: 9990,
      features: [
        '3 Projects',
        '5 Team Members',
        'Basic Support',
        '10GB Storage'
      ]
    },
    {
      id: 'plan_pro',
      name: 'Professional',
      description: 'For growing teams',
      monthlyPriceCents: 2999,
      yearlyPriceCents: 29990,
      features: [
        'Unlimited Projects',
        '25 Team Members',
        'Priority Support',
        '100GB Storage',
        'Advanced Analytics'
      ],
      isPopular: true
    },
    {
      id: 'plan_enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      monthlyPriceCents: 9999,
      yearlyPriceCents: 99990,
      features: [
        'Unlimited Everything',
        'Unlimited Team Members',
        '24/7 Support',
        'Unlimited Storage',
        'Custom Integrations',
        'SLA Guarantee'
      ]
    }
  ];

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private diagnostics: SystemDiagnosticsTraceService
  ) {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }

  ngOnInit(): void {
    this.paymentService.loadPaymentMethods();
    this.paymentService.loadSubscription();

    // Pre-select default payment method
    const defaultMethod = this.paymentService.defaultPaymentMethod();
    if (defaultMethod) {
      this.selectedPaymentMethodId = defaultMethod.id;
    }
  }

  // Helpers
  formatPrice = formatAmount;

  /**
   * Get selected payment method's last 4 digits
   */
  getSelectedMethodLast4(): string {
    if (!this.selectedPaymentMethodId) return '';
    const method = this.paymentMethods().find(p => p.id === this.selectedPaymentMethodId);
    return method?.last4 || '';
  }

  /**
   * Get price for current billing interval
   */
  getPlanPrice(plan: PricingPlan): number {
    return this.billingInterval === 'monthly' 
      ? plan.monthlyPriceCents 
      : plan.yearlyPriceCents;
  }

  /**
   * Toggle billing interval
   */
  toggleBillingInterval(): void {
    this.billingInterval = this.billingInterval === 'monthly' ? 'yearly' : 'monthly';
  }

  /**
   * Select a plan and move to payment step
   */
  selectPlan(plan: PricingPlan): void {
    this.selectedPlan = plan;
    this.currentStep = 'payment';
  }

  /**
   * Go back to plan selection
   */
  goBackToPlanSelection(): void {
    this.currentStep = 'select-plan';
  }

  /**
   * Proceed to confirmation
   */
  proceedToConfirm(): void {
    if (!this.selectedPaymentMethodId) {
      this.error = 'Please select a payment method';
      return;
    }
    this.error = '';
    this.currentStep = 'confirm';
  }

  /**
   * Complete the subscription
   */
  confirmSubscription(): void {
    if (!this.selectedPlan || !this.selectedPaymentMethodId) return;

    this.processing = true;
    this.error = '';

    this.paymentService.createSubscription({
      planId: this.selectedPlan.id,
      paymentMethodId: this.selectedPaymentMethodId
    }).subscribe({
      next: () => {
        this.processing = false;
        this.currentStep = 'success';
      },
      error: (err) => {
        this.processing = false;
        this.error = 'Failed to create subscription. Please try again.';
      }
    });
  }

  /**
   * Navigate to dashboard after success
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboards/main']);
  }
}
