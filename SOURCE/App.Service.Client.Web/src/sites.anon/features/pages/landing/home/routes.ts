// Ag:
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Etc:
import { BaseAppsPagesHomeIndexComponent } from './components/component';


const routes: Routes = [
  // We're basically saying that
  // parent module (base.module) associated 'page'
  // to a a routeroutlet containing component it managed,
  // and into it loaded this module.
  // This module then provided no further router-outlets, just pages
  // within its resposibility, such that
  // 'base/pages/' or 'base/pages/layout' loads a router-controller
  // it manages, and within that, loads deeper module.
  // Note:
  // Admittedly in he case of information, their simplicity doesn't
  // warant a module for each, but out of habit I *think* I prefer paying
  // a rigour price early, in case I manouverability later.
  { path: '', component: BaseAppsPagesHomeIndexComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BaseCoreHomeRoutingModule {


}
