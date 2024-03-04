import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { IndexComponent } from "./index/component";
import { JobComponent } from './job/component';

const routes: Routes = [
  {path: "",    component: IndexComponent},
  {path: "job", component: JobComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LandingRoutingModule { }
