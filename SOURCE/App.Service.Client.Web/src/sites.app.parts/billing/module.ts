/**
 * Billing Module
 * 
 * Handles all billing-related functionality:
 * - REFUND FIRST - Easy refunds with no friction
 * - Payment methods management
 * - Subscription flow
 * - Transaction history
 * - Invoice management
 * 
 * URL prefix: /system/billing
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Routing
import { BillingRoutingModule } from './routing';

// Core modules
import { BaseCoreAgComponentsModule } from '../../core.ag/components.default/module';
import { BaseCoreAgPipesModule } from '../../core.ag/pipes/module';

// Views
import { PaymentHubComponent } from './ui/views/payment-hub/component';
import { PaymentMethodsComponent } from './ui/views/payment-methods/component';
import { SubscribeComponent } from './ui/views/subscribe/component';
import { TransactionsComponent } from './ui/views/transactions/component';
import { RefundComponent } from './ui/views/refund/component';

@NgModule({
  declarations: [
    PaymentHubComponent,
    PaymentMethodsComponent,
    SubscribeComponent,
    TransactionsComponent,
    RefundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    BillingRoutingModule,
    BaseCoreAgComponentsModule,
    BaseCoreAgPipesModule
  ],
  exports: [
    PaymentHubComponent,
    PaymentMethodsComponent,
    SubscribeComponent,
    TransactionsComponent,
    RefundComponent
  ]
})
export class BillingModule { }
