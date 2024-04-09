import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Services:
import { SystemDiagnosticsTraceService } from '../../services/system.diagnostics-trace.service';

// Components
import { BaseErrorsOfflineComponent } from "./000/offline/component";
import { BaseErrors404BasicComponent } from "./404/basic/component";
import { BaseErrors404CoverComponent } from "./404/cover/component";
import { BaseErrors404AltComponent } from "./404/alt/component";
import { BaseErrors500TodoComponent } from "./500/component";

const routes: Routes = [
  {
    path:"404-basic",
    component: BaseErrors404BasicComponent
  },
  {
    path: "404-cover",
    component: BaseErrors404CoverComponent
  },
  {
    path: "404-alt",
    component: BaseErrors404AltComponent
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
    path: "000", redirectTo: 'offline'
  },
  {
    path: "404", redirectTo: '404-basic'
  },
  {
    path: "500", redirectTo: '500-default' 
  },
  {
    path: "**", redirectTo:"404-basic"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppBaseErrorsRoutingModule {


  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }
}
