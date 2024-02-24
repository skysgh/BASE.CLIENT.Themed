import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpikesReadComponent } from "./ui/read/spikes-read.component";
import { SpikesEditComponent } from './ui/edit/spikes-edit.component';

const routes: Routes = [
  { path: '', component: SpikesReadComponent},
  { path: 'edit', component: SpikesEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SpikesRoutingModule { }
