/**
 * Wiki Module
 * 
 * Full-featured wiki system with namespace-based permissions.
 * 
 * Structure:
 * - /wiki                    → Wiki Hub (namespace browser)
 * - /wiki/:namespace         → Namespace page list
 * - /wiki/:namespace/:slug   → Page viewer
 * - /wiki/edit/:namespace/:slug → Page editor (requires auth)
 * 
 * Features:
 * - Namespace-based organization (public, internal, admin)
 * - Markdown content with syntax highlighting
 * - Role-based permissions
 * - Hierarchical page structure
 * - Search across all accessible pages
 * 
 * Storage:
 * - Metadata: Database (permissions, hierarchy, versioning)
 * - Content: Azure Blob (portable markdown files)
 * 
 * URL: /wiki or /app/wiki (depending on auth context)
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Core
import { ConfigRegistryService } from '../../core/services/config-registry.service';

// Views
import { WikiHubComponent } from './ui/views/wiki-hub/component';
import { WikiPageViewComponent } from './ui/views/wiki-page-view/component';
import { WikiEditorComponent } from './ui/views/wiki-editor/component';
import { WikiSidebarComponent } from './ui/widgets/wiki-sidebar/component';
import { WikiViewerComponent } from './ui/widgets/wiki-viewer/component';

// Constants
import { WIKI_CONSTANTS } from './constants';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      // Wiki Hub - main entry point
      { path: '', component: WikiHubComponent },
      
      // Editor (must come before wildcard routes)
      { path: 'edit/:namespace/:slug', component: WikiEditorComponent },
      { path: 'edit/:namespace', component: WikiEditorComponent },
      
      // Page viewer with wildcard path support
      { path: ':namespace/:slug', component: WikiPageViewComponent },
      { path: ':namespace', component: WikiPageViewComponent },
    ]),
    // Standalone components
    WikiHubComponent,
    WikiPageViewComponent,
    WikiEditorComponent,
    WikiSidebarComponent,
    WikiViewerComponent,
  ],
  exports: [
    RouterModule,
    WikiViewerComponent,
    WikiSidebarComponent,
  ]
})
export class WikiModule {
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('applets.wiki', {
      constants: WIKI_CONSTANTS
    });
  }
}
