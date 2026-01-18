/**
 * Sites Module
 * 
 * Foundational module for all site implementations.
 * Provides common dependencies and re-exports parent tier modules.
 * 
 * Architecture Position:
 *   core        -> Pure TypeScript
 *   core.ag     -> Angular infrastructure  
 *   themes      -> Visual chrome
 *   sites       -> THIS: Shared site patterns (imports themes, exports themes)
 *   sites.anon  -> Public pages (imports sites)
 *   sites.app   -> App shell (imports sites)
 *   sites.app.* -> Features (import sites)
 * 
 * What this module provides:
 * - Re-exports of BaseCoreAgModule, BaseThemesModule
 * - (Future) Shared site-level widgets (PageHeader, EmptyState, etc.)
 * - (Future) Shared site-level services
 * 
 * Lazy Loading:
 * This module is designed for lazy loading compatibility.
 * Child tiers import SitesModule which brings in the dependency chain.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Parent tier
import { BaseThemesModule } from '../themes/module';

// Re-export commonly used Angular modules for convenience
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Parent tier - this brings in core.ag and core
    BaseThemesModule,
  ],
  exports: [
    // Re-export for child tiers
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BaseThemesModule,
    // Future: Site-level widgets will be exported here
    // PageHeaderComponent,
    // EmptyStateComponent,
    // LoadingStateComponent,
  ]
})
export class SitesModule {
  constructor() {
    console.log('[SitesModule] Initialized - shared site infrastructure ready');
  }
}
