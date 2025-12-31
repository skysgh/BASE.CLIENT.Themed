/**
 * Tables Reference Routing
 * 
 * Near-direct copy from Velzon theme: pages/tables/tables-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { BasicComponent } from "./basic/basic.component";
import { GridjsComponent } from "./gridjs/gridjs.component";
import { ListjsComponent } from "./listjs/listjs.component";

const routes: Routes = [
  // Default to basic tables
  {
    path: '',
    redirectTo: 'basic',
    pathMatch: 'full'
  },
  { path: "basic", component: BasicComponent },
  { path: "gridjs", component: GridjsComponent },
  { path: "listjs", component: ListjsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesReferenceRoutingModule { }
