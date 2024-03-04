import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchitectureValuesBrowseComponent } from './ui/browse/component';
import { ArchitectureValuesReadComponent } from "./ui/read/component";
import { ArchitectureValuesEditComponent } from './ui/edit/component';

const routes: Routes = [
  { path: 'browse', component: ArchitectureValuesBrowseComponent },
  { path: 'view/:id', component: ArchitectureValuesReadComponent },
  { path: 'edit/:id', component: ArchitectureValuesEditComponent },
  { path: '', redirectTo:'browse' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BaseAppsSpikesRoutingModule { }
