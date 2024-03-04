// Base are define in a Module
// outside of the deployment module
// so that it can be imported by child/feature
// models later.

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Module specific components:
import { BaseAppsRouteComponent } from "./ui/_route/component";
import { TranslateService } from '@ngx-translate/core';


//import { BasePagesInformationModule } from '../base/pages/information/module';
//

const routes: Routes = [
  // We're effectively saying, load this modules component (CustomAppsRouteComponent)
  // which it can see, and when that's done, load into it a Module.
  // Which has routing, and therefore will point to that module's appropriate control
  // which may be another router (it is in this case).

  { path: 'spike', loadChildren: () => import('./spike/module').then(m => m.SpikeModule) },
  { path: '', redirectTo:'spike' , pathMatch:'prefix' },

  //{ path: 'architecture', component: AppsRouteComponent, loadChildren: () => import('./architecture/module').then(m => m.ArchitectureModule) },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports: [RouterModule]
})

export class BaseAppsRoutingModule { }
