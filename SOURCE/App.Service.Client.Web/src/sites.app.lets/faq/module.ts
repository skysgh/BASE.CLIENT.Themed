/**
 * FAQ Module
 * 
 * FAQ management with dynamic categories.
 * 
 * Features:
 * - Public FAQ viewing with accordion display
 * - Admin category management (BREAD)
 * - Admin FAQ item management (BREAD)
 * - Dynamic category loading
 * - Culture/language support
 * 
 * Routes:
 * - /                    → FAQ Hub (public view)
 * - /admin/categories    → Category management
 * - /admin/categories/add → Add category
 * - /admin/categories/:id/edit → Edit category
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Views
import { FaqHubComponent } from './ui/views/faq-hub/component';
import { CategoryBrowseComponent } from './ui/views/admin/category-browse/component';
import { CategoryEditComponent } from './ui/views/admin/category-edit/component';

// Services
import { FaqCategoryService, FaqItemService } from './services';
import { FaqCategoryRepository, FaqItemRepository } from './repositories';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      // Public routes
      { path: '', component: FaqHubComponent },
      
      // Admin routes (future: role-gated)
      { path: 'admin/categories', component: CategoryBrowseComponent },
      { path: 'admin/categories/add', component: CategoryEditComponent },
      { path: 'admin/categories/:id/edit', component: CategoryEditComponent },
      
      // Future: Item management
      // { path: 'admin/items', component: ItemBrowseComponent },
      // { path: 'admin/items/add', component: ItemEditComponent },
      // { path: 'admin/items/:id/edit', component: ItemEditComponent },
    ]),
    
    // Standalone components
    FaqHubComponent,
    CategoryBrowseComponent,
    CategoryEditComponent,
  ],
  exports: [RouterModule],
  providers: [
    FaqCategoryService,
    FaqItemService,
    FaqCategoryRepository,
    FaqItemRepository,
  ],
})
export class FaqModule {}
