/**
 * Payment Processing Routing
 * 
 * Routes for payment processing applet.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTE_PREFIX } from './constants/service-payment-processing.constants';

// Views
import { PaymentHubComponent } from './views/payment-hub/component';
import { PaymentMethodsComponent } from './views/payment-methods/component';
import { SubscribeComponent } from './views/subscribe/component';
import { TransactionsComponent } from './views/transactions/component';

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
      title: 'Payment Hub',
      breadcrumb: 'Hub'
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
export class ServicePaymentProcessingRoutingModule { }
