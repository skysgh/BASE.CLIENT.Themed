import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Module specific components:
import { CustomAppsRouteComponent } from "./ui/_route/component";
//


const routes: Routes = [
  // We're effectively saying, load this modules component (CustomAppsRouteComponent)
  // which it can see, and when that's done, load into it a Module.
  // Which has routing, and therefore will point to that module's appropriate control
  // which may be another router (it is in this case).
  { path: 'spikes', component: CustomAppsRouteComponent, loadChildren: () => import('./spikes/module').then(m => m.SpikesModule) },
  //{ path: 'architecture', component: AppsRouteComponent, loadChildren: () => import('./architecture/module').then(m => m.ArchitectureModule) },
  { path: '', redirectTo: 'spikes', pathMatch:'prefix'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CustomAppsRoutingModule { }
