// Import Ag:
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Commons:

// Import SubModules:
import { SpikesSpikeModule } from "./modules/spike/module";

// Import Modules Specific:
import { SpikesRouteComponent } from './ui/_route/component';

const routes: Routes = [
  // we're basically saying load a control from this module,
  // which happens to be a router-output, and into that
  // load the module for specific group of views:
  { path: 'spike', component: SpikesRouteComponent, loadChildren: () => import('./modules/spike/module').then(m => m.SpikesSpikeModule), /*canActivate: [AuthGuard]*/ },
  // Until there are other entities:
  { path: '', redirectTo: 'spike', pathMatch: 'prefix' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SpikesRoutingModule { }
