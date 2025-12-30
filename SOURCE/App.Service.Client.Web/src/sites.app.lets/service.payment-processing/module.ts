/**
 * Service Payment Processing Module
 * 
 * Handles all payment-related functionality:
 * - Payment methods management
 * - Subscription flow
 * - Transaction history
 * - Checkout integration
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Routing
import { ServicePaymentProcessingRoutingModule } from './routing';

// Core modules
import { CoreComponentsModule } from '../../core/components/module';
import { BaseCoreAgPipesModule } from '../../core.ag/pipes/module';

// Views
import { PaymentHubComponent } from './views/payment-hub/component';
import { PaymentMethodsComponent } from './views/payment-methods/component';
import { SubscribeComponent } from './views/subscribe/component';
import { TransactionsComponent } from './views/transactions/component';

@NgModule({
  declarations: [
    PaymentHubComponent,
    PaymentMethodsComponent,
    SubscribeComponent,
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    ServicePaymentProcessingRoutingModule,
    CoreComponentsModule,
    BaseCoreAgPipesModule
  ],
  exports: [
    PaymentHubComponent,
    PaymentMethodsComponent,
    SubscribeComponent,
    TransactionsComponent
  ]
})
export class ServicePaymentProcessingModule { }
