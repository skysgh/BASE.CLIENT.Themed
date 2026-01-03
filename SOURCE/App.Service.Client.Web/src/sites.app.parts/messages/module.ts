/**
 * Messages Module
 * 
 * Internal messaging system for users.
 * 
 * Features:
 * - Inbox: View received messages
 * - Sent: View sent messages
 * - Compose: Create new messages
 * - Trash: Deleted messages
 * - Starred/Favorites
 * - Labels/Categories
 * 
 * Two View Modes:
 * 
 * 1. CLASSIC (Email-like UI):
 *    Traditional email client layout with:
 *    - Sidebar navigation (folders, labels)
 *    - Message list with preview
 *    - Reading pane
 *    
 * 2. STANDARD (BREAD pattern - future):
 *    Schema-driven views using standard entity patterns:
 *    - Browse: List messages with filters
 *    - Read: Message detail view
 *    - Add: Compose message
 *    - Delete: Soft delete
 *    
 *    Note: Standard view to be implemented after schema patterns
 *    are finalized in spike module.
 * 
 * Views:
 * - Hub: Entry point with stats and quick actions
 * - Classic/Mailbox: Email-like interface (default)
 * - Standard/* (future): BREAD pattern views
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Core
import { ConfigRegistryService } from '../../core/services/config-registry.service';

// Views
import { MessagesHubComponent } from './ui/views/messages-hub/component';
import { ClassicMailboxComponent } from './ui/views/classic/mailbox/component';

// Services
import { MessageService } from './services/message.service';

// Constants
import { MESSAGES_CONSTANTS } from './constants';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      // Hub - Entry point with quick actions
      { path: '', component: MessagesHubComponent },
      
      // Classic email-like views
      { path: 'classic', component: ClassicMailboxComponent },
      { path: 'classic/:folder', component: ClassicMailboxComponent },
      
      // Convenience aliases
      { path: 'inbox', redirectTo: 'classic/inbox', pathMatch: 'full' },
      { path: 'compose', redirectTo: 'classic/compose', pathMatch: 'full' },
      
      // Future: Standard BREAD views
      // { path: 'standard', loadChildren: () => import('./features/standard/module').then(m => m.MessagesStandardModule) },
    ]),
    
    // Standalone components
    MessagesHubComponent,
    ClassicMailboxComponent,
  ],
  exports: [RouterModule],
  providers: [
    MessageService,
  ],
})
export class MessagesModule {
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('applets.messages', {
      constants: MESSAGES_CONSTANTS
    });
  }
}
