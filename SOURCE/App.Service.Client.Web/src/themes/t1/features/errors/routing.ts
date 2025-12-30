import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Services:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

// Legacy Components (kept for backwards compatibility)
import { BaseErrorsOfflineComponent } from "./000/offline/component";
import { BaseErrors404BasicComponent } from "./404/basic/component";
import { BaseErrors500TodoComponent } from "./500/component";
import { BaseErrorsAccountNotFoundComponent } from "./404/account-not-found/component";

// NEW: Parameterized error components
import { ErrorPageBasicComponent } from "./_parameterized/basic/component";
import { ErrorPageCoverComponent } from "./_parameterized/cover/component";
import { ErrorPageAltComponent } from "./_parameterized/alt/component";

const routes: Routes = [
  // ============================================
  // NEW: Parameterized routes (preferred)
  // Route: /errors/basic/:code, /errors/cover/:code, /errors/alt/:code
  // Example: /errors/basic/404, /errors/cover/500
  // ============================================
  {
    path: "basic/:code",
    component: ErrorPageBasicComponent
  },
  {
    path: "cover/:code",
    component: ErrorPageCoverComponent
  },
  {
    path: "alt/:code",
    component: ErrorPageAltComponent
  },

  // ============================================
  // Legacy routes (kept for backwards compatibility)
  // These redirect to the new parameterized routes
  // ============================================
  {
    path: "404-basic",
    component: BaseErrors404BasicComponent  // Keep legacy component
  },
  {
    path: "500-default",
    component: BaseErrors500TodoComponent   // Keep legacy component
  },
  {
    path: "offline",
    component: BaseErrorsOfflineComponent   // Keep legacy component
  },
  {
    path: "404-account-not-found",
    component: BaseErrorsAccountNotFoundComponent  // Keep legacy component
  },
  
  // Redirects: Short codes to parameterized routes
  {
    path: "000", redirectTo: 'basic/000', pathMatch: 'full'
  },
  {
    path: "401", redirectTo: 'basic/401', pathMatch: 'full'
  },
  {
    path: "403", redirectTo: 'basic/403', pathMatch: 'full'
  },
  {
    path: "404", redirectTo: 'basic/404', pathMatch: 'full'
  },
  {
    path: "404-A", redirectTo: 'alt/404-A', pathMatch: 'full'
  },
  {
    path: "500", redirectTo: 'basic/500', pathMatch: 'full'
  },
  {
    path: "502", redirectTo: 'basic/502', pathMatch: 'full'
  },
  {
    path: "503", redirectTo: 'basic/503', pathMatch: 'full'
  },
  
  // Default: Empty path redirects to 404 basic
  {
    path: "", redirectTo: "basic/404", pathMatch: 'full'
  },
  
  // Catch-all: Unknown error routes go to 404 basic
  {
    path: "**", redirectTo: "basic/404", pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseThemesV1ErrorsRoutingModule {
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }
}
