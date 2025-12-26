import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseCoreDashboardsIndexComponent } from './components/index/component';

const routes: Routes = [
  {
    path: 'main', component: BaseCoreDashboardsIndexComponent,
  },
  {
    path: '', redirectTo: 'main', pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BaseCoreDashboardsRouterModule { }
