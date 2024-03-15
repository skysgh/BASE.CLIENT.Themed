import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseAppsArchitectureValuesBrowseComponent } from './ui/browse/component';
import { BaseAppsArchitectureValuesReadComponent } from "./ui/read/component";
import { BaseAppsArchitectureValuesEditComponent } from './ui/edit/component';

const routes: Routes = [
  { path: 'browse', component: BaseAppsArchitectureValuesBrowseComponent },
  { path: 'view/:id', component: BaseAppsArchitectureValuesReadComponent },
  { path: 'edit/:id', component: BaseAppsArchitectureValuesEditComponent },
  { path: '', redirectTo:'browse' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BaseAppsSpikesRoutingModule { }
