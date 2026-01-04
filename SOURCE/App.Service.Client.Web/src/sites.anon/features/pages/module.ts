// Rx:
//
// Import Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import Module specific.components:
// ✅ UPDATED: Path changed from ./components/ to ./ui/views/
import { BaseCorePagesROComponent } from './ui/views/_routeoutlet/component';

import { BaseThemesV1Module } from '../../../themes/t1/module';

// Services:
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { BaseThemesModule } from '../../../themes/module';
// ✅ Import parent module to get access to its providers (tokens)
import { BaseCoreSitesModule } from '../../module';
// Configuration:
import { sitesConfiguration } from '../../configuration/implementation/sites.configuration';

@NgModule({
  declarations: [
    BaseCorePagesROComponent,
  ],
  providers: [
  ],
  imports: [
    CommonModule,

    // ✅ Import parent module FIRST to get token providers
    BaseCoreSitesModule,
    
    // Import Base of Upstream Column: Themes, which depends on Core.Ag:
    BaseThemesModule,
    
    RouterModule.forChild(
      [
        // ✅ ADDED: Default redirect to landing
        { path: '', redirectTo: 'landing', pathMatch: 'full' },
        // Lazy load child feature modules
        { path: 'landing', loadChildren: () => import('./landing/module').then(m => m.BaseCorePagesLandingModule) },
        { path: 'information', loadChildren: () => import('./information/module').then(m => m.BaseCorePagesInformationModule) },
        // ✅ UPDATED: Signed-out now in auth-landing feature with proper structure
        { path: 'signed-out', loadComponent: () => import('../auth-landing/ui/pages/signed-out/component').then(m => m.SignedOutLandingComponent) },
      ]
    ),
    
    FormsModule,
  ],
  exports: [
  ]
})
export class BaseCoreSitesFeaturesPagesModule {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug("BasePagesModule.constructor()");
  }
}
