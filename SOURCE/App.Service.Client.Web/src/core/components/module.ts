/**
 * Core Components Module
 * 
 * Shared reusable components for applets and views.
 * These components are not specific to any theme.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

// Components
import { ChildSummaryComponent } from "./child-summary/child-summary.component";


@NgModule({
  declarations: [
    ChildSummaryComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ChildSummaryComponent
  ]
})
export class CoreComponentsModule { }
