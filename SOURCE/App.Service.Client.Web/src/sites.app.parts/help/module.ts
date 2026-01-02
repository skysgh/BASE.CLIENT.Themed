/**
 * Help Module
 * 
 * Platform applet for user documentation and training.
 * 
 * Structure:
 * - /system/help           → Help Hub (choose FAQ or Wiki)
 * - /system/help/faq       → FAQ page (uses shared FaqViewerComponent)
 * - /system/help/wiki      → Wiki documentation hub
 * - /system/help/wiki/article/:id → Article viewer
 * - /system/help/wiki/category/:id → Category browser
 * 
 * Features:
 * - Internal wiki-style documentation OR external URL redirect
 * - FAQ section (reuses describe app.part data)
 * - Culture-aware article loading (en, fr, etc.)
 * - Markdown article rendering
 * - Full-text search
 * 
 * Configuration:
 * - mode: 'internal' | 'external'
 * - externalUrl: URL to external documentation (Confluence, GitBook, etc.)
 * 
 * URL: /system/help
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Core
import { ConfigRegistryService } from '../../core/services/config-registry.service';

// Views
import { HelpHubComponent } from './views/help-hub/component';
import { HelpFaqPageComponent } from './views/faq-page/component';
import { WikiHubComponent } from './views/wiki-hub/component';
import { ArticleViewerComponent } from './views/article-viewer/component';
import { CategoryViewerComponent } from './views/category-viewer/component';

// Constants
import { HELP_CONSTANTS } from './constants';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild([
      // Help Hub - main entry point
      { path: '', component: HelpHubComponent },
      
      // FAQ Section
      { path: 'faq', component: HelpFaqPageComponent },
      
      // Wiki Section
      { path: 'wiki', component: WikiHubComponent },
      { path: 'wiki/article/:articleId', component: ArticleViewerComponent },
      { path: 'wiki/category/:categoryId', component: CategoryViewerComponent },
      
      // Legacy routes (backwards compatibility)
      { path: 'article/:articleId', redirectTo: 'wiki/article/:articleId' },
      { path: 'category/:categoryId', redirectTo: 'wiki/category/:categoryId' },
    ]),
    // Standalone components
    HelpHubComponent,
    HelpFaqPageComponent,
    WikiHubComponent,
    ArticleViewerComponent,
    CategoryViewerComponent,
  ],
  exports: [RouterModule]
})
export class HelpModule {
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('applets.help', {
      constants: HELP_CONSTANTS
    });
  }
}
