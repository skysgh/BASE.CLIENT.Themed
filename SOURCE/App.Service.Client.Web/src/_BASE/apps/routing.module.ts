import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Module specific components:
import { CustomAppsRouteComponent } from "./ui/_route/component";
import { TranslateService } from '@ngx-translate/core';


//import { BasePagesInformationModule } from '../base/pages/information/module';
//


const routes: Routes = [
  // We're effectively saying, load this modules component (CustomAppsRouteComponent)
  // which it can see, and when that's done, load into it a Module.
  // Which has routing, and therefore will point to that module's appropriate control
  // which may be another router (it is in this case).
  
 //{ path: 'dashboard', component: CustomAppsRouteComponent, loadChildren: () => import('./dashboard/module').then(m => m.AppsDashboardModule) },
  { path: 'information', component: CustomAppsRouteComponent, loadChildren: () => import('../core/pages/information/module').then(m => m.BasePagesInformationModule) },
  { path: 'spike', component: CustomAppsRouteComponent, loadChildren: () => import('./spike/module').then(m => m.SpikeModule) },
  //{ path: 'architecture', component: AppsRouteComponent, loadChildren: () => import('./architecture/module').then(m => m.ArchitectureModule) },
  { path: '', redirectTo: 'spike', pathMatch:'prefix'}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports: [RouterModule]
})

export class CustomAppsRoutingModule { }
