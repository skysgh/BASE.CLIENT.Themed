// Import Ag:
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Common:
// ...
// Import SubModules:
import { BaseAppsArchitectureValuesModule } from './modules/values/module';



const routes: Routes = [
  { path: 'values', component: BaseAppsArchitectureValuesModule},
  { path: '', redirectTo: 'values/' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ArchitectureRoutingModule { }
