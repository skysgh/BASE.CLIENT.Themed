import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Services:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

// Components
import { BaseErrorsOfflineComponent } from "./000/offline/component";
import { BaseErrors404BasicComponent } from "./404/basic/component";
import { BaseErrors500TodoComponent } from "./500/component";
import { BaseErrorsAccountNotFoundComponent } from "./404/account-not-found/component";

const routes: Routes = [
  {
    path:"404-basic",
    component: BaseErrors404BasicComponent
  },
  {
    path: "500-default",
    component: BaseErrors500TodoComponent
  },
  {
    path: "offline",
    component: BaseErrorsOfflineComponent
  },
  {
    path: "404-account-not-found",
    component: BaseErrorsAccountNotFoundComponent
  },
  // Redirects
  {
    path: "000", redirectTo: 'offline', pathMatch: 'full'
  },
  {
    path: "404", redirectTo: '404-basic', pathMatch: 'full'
  },
  {
    path: "500", redirectTo: '500-default', pathMatch: 'full'
  },
  // Catch-all: Unknown error routes go to 404-basic
  {
    path: "**", redirectTo: "404-basic", pathMatch: 'full'
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
