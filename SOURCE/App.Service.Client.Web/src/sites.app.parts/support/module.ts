/**
 * Support Module
 * 
 * User-facing support ticket system for issues and ideas.
 * 
 * Features:
 * - Submit issues (bugs, problems)
 * - Submit ideas (feature requests)
 * - Track status of submissions
 * - Add comments to items
 * 
 * Views:
 * - Hub: Entry point with stats and quick actions
 * - Browse: List/board view of user's submissions
 * - Read: Detail view with progress visualization
 * - Add: Submit new issue or idea
 * 
 * BREAD Pattern:
 * - Browse → my-items (with view renderers)
 * - Read → item/:id
 * - Edit → (admin only, future)
 * - Add → new/:type
 * - Delete → (soft delete, future)
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Views
import { SupportHubComponent } from './views/support-hub/component';
import { ItemBrowseComponent } from './views/item-browse/component';
import { ItemReadComponent } from './views/item-read/component';
import { ItemAddComponent } from './views/item-add/component';

// Services
import { SupportItemService } from './services';
import { SupportItemRepository } from './repositories/support-item.repository';
import { SupportItemCardBroker } from './brokers';

// Core
import { CardBrokerRegistry } from '../../core/models/presentation/card-broker.model';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      // Hub - Entry point
      { path: '', component: SupportHubComponent },
      
      // BREAD routes
      { path: 'my-items', component: ItemBrowseComponent },
      { path: 'item/:id', component: ItemReadComponent },
      { path: 'new/:type', component: ItemAddComponent },
      
      // Aliases
      { path: 'issues', redirectTo: 'my-items', pathMatch: 'full' },
      { path: 'ideas', redirectTo: 'my-items', pathMatch: 'full' },
      
      // Future: Admin routes (role-gated)
      // { path: 'admin', component: AdminHubComponent },
      // { path: 'admin/board', component: AdminBoardComponent },
    ]),
    
    // Standalone components
    SupportHubComponent,
    ItemBrowseComponent,
    ItemReadComponent,
    ItemAddComponent,
  ],
  exports: [RouterModule],
  providers: [
    SupportItemService,
    SupportItemRepository,
    SupportItemCardBroker,
  ],
})
export class SupportModule {
  constructor(
    brokerRegistry: CardBrokerRegistry,
    supportBroker: SupportItemCardBroker
  ) {
    // Register broker for Universal Search
    brokerRegistry.register(supportBroker);
  }
}
