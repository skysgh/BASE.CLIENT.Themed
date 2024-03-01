// Import Ag:
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Common:
// ...
// Import SubModules:
import { ArchitectureValuesModule } from './modules/values/module';



const routes: Routes = [
  { path: 'values', component: ArchitectureValuesModule},
  { path: '', redirectTo: 'values/' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ArchitectureRoutingModule { }
