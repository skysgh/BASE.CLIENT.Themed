import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Views
import { SearchHubComponent } from './views/search-hub/component';

/**
 * Search Applet Module
 * 
 * Universal Search capability - the "Browse" part of BREAD.
 * Provides a unified search experience across all entity types.
 * 
 * Key Features:
 * - Faceted search across multiple entity types
 * - Entity type filtering
 * - Full-text search with highlights
 * - Recent searches
 * - Saved searches
 * 
 * Architecture:
 * - Search is NOT a table - it's a rich discovery experience
 * - Each entity type registers its searchable fields
 * - Results are displayed as cards, not rows
 * - Drill-down navigates to entity's Read view
 * 
 * Routes:
 * - /system/search             → Universal search hub
 * - /system/search?q=term      → Pre-populated search
 * - /system/search?type=spike  → Filtered by entity type
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: SearchHubComponent },
    ]),
    // Standalone components
    SearchHubComponent,
  ],
  exports: [RouterModule]
})
export class SearchModule { }
