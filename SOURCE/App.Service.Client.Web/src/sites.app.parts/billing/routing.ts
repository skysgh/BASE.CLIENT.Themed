/**
 * Billing Routing
 * 
 * Routes for billing applet.
 * URL prefix: /system/billing
 * 
 * PHILOSOPHY: Refund First
 * - Refund route is prominent and easy to find
 * - No barriers, no friction
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Views
import { PaymentHubComponent } from './views/payment-hub/component';
import { PaymentMethodsComponent } from './views/payment-methods/component';
import { SubscribeComponent } from './views/subscribe/component';
import { TransactionsComponent } from './views/transactions/component';
import { RefundComponent } from './views/refund/component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'hub',
    pathMatch: 'full'
  },
  {
    path: 'hub',
    component: PaymentHubComponent,
    data: {
      title: 'Billing Hub',
      breadcrumb: 'Hub'
    }
  },
  // REFUND FIRST - Easy to find, no barriers
  {
    path: 'refund',
    component: RefundComponent,
    data: {
      title: 'Request Refund',
      breadcrumb: 'Refund'
    }
  },
  {
    path: 'payment-methods',
    component: PaymentMethodsComponent,
    data: {
      title: 'Payment Methods',
      breadcrumb: 'Payment Methods'
    }
  },
  {
    path: 'subscribe',
    component: SubscribeComponent,
    data: {
      title: 'Subscribe',
      breadcrumb: 'Subscribe'
    }
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    data: {
      title: 'Transaction History',
      breadcrumb: 'Transactions'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
