import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { BasicComponent } from "./basic/component";
import { CoverComponent } from "./cover/component";
import { AltComponent } from "./alt/component";
import { Page500Component } from "./page500/component";
import { OfflineComponent } from "./offline/component";

const routes: Routes = [
  {
    path:"404-basic",
    component: BasicComponent
  },
  {
    path: "404-cover",
    component: CoverComponent
  },
  {
    path: "404-alt",
    component: AltComponent
  },
  {
    path: "page-500",
    component: Page500Component
  },
  {
    path: "offline",
    component: OfflineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Error404RoutingModule { }