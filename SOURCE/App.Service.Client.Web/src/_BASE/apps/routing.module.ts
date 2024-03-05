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
import { AppBaseErrorsModule } from '../core/errors/module';


//import { BasePagesInformationModule } from '../base/pages/information/module';
//

const routes: Routes = [
  // We're effectively saying, load this modules component (CustomAppsRouteComponent)
  // which it can see, and when that's done, load into it a Module.
  // Which has routing, and therefore will point to that module's appropriate control
  // which may be another router (it is in this case).

  { path: 'spike', loadChildren: () => import('./spike/module').then(m => m.BaseAppsSpikeModule) , pathMatch:'prefix'},
  // others applets
  //{ path: 'architecture', loadChildren: () => import('./architecture/module').then(m => m.ArchitectureModule) },
  //{ path: 'people', loadChildren: () => import('./people/module').then(m => m.BaseAppsPeopleModule) },
  //{ path: 'products', loadChildren: () => import('./products/module').then(m => m.BaseAppsProductsModule) },
  //{ path: 'places', loadChildren: () => import('./places/module').then(m => m.BaseAppsPlacesModule) },
  //{ path: 'participations', loadChildren: () => import('./places/module').then(m => m.BaseAppsParticipationsModule) },
  //{ path: 'assessments', loadChildren: () => import('./places/module').then(m => m.BaseAppsAssessmentsModule) },
  //{ path: 'progress', loadChildren: () => import('./places/module').then(m => m.BaseAppsProgressModule) },
  //{ path: 'achievements', loadChildren: () => import('./places/module').then(m => m.BaseAppsAchievementsModule) },
  { path: '', redirectTo:'spike', pathMatch: 'prefix' }
  // THere is no default app (it would be parent that would default to 'index' page. )
  //{ path: '**'  ,   }

];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports: [RouterModule]
})

export class BaseAppsRoutingModule { }
