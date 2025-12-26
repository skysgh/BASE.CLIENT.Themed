// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

// ✅ NEW: Config Registry
import { ConfigRegistryService } from '../core/services/config-registry.service';

// Child Modules:
import { BaseCoreAgComponentsModule } from './components.default/module';
import { BaseCoreAgDirectivesModule } from './directives/module';
import { BaseCoreAgInterceptorsModule } from './interceptors/module';
import { BaseCoreAgPipesModule } from './pipes/module';

/**
 * Module that contains all the *non-themed* (ie portable)
 * core UI components, directives and pipes.
 *
 * Note:
 * for themed equivalent, see 'BaseThemesV1Module'.
 * 
 * To use with authentication state, import StoreModule with your reducer
 * in the consuming application's root module.
 * 
 * ✅ NOW: Registers itself in ConfigRegistry for decoupled config access.
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [
    // Remove theme-specific authentication reducer from here
    // It should be registered in the theme or app module instead
    
    // Child Modules:
    BaseCoreAgComponentsModule,
    BaseCoreAgDirectivesModule,
    BaseCoreAgPipesModule,
    BaseCoreAgInterceptorsModule, 
  ],
  exports: [
    BaseCoreAgComponentsModule,
    BaseCoreAgDirectivesModule,
    BaseCoreAgPipesModule,
    BaseCoreAgInterceptorsModule
  ]
})
export class BaseCoreAgModule {
  /**
   * ✅ NEW: Register Core.Ag config
   * 
   * Core.Ag is infrastructure (Angular-specific foundation).
   * Minimal config - just version/metadata.
   */
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('core.ag', {
      version: '1.0.0',
      description: 'Angular foundation layer',
      // Future: Add Core.Ag-specific config here (e.g., component defaults)
    });
  }
}
