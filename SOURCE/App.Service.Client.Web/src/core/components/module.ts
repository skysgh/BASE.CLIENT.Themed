/**
 * Core Components Module
 * 
 * Shared reusable components for applets and views.
 * These components are not specific to any theme.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

// Components
import { ChildSummaryComponent } from "./child-summary/child-summary.component";

// Standalone Components (re-exported for convenience)
import { 
  DrillSelectorComponent,
  SelectionSummaryComponent,
  OptionsPanelComponent
} from './drill-selector';

import { FaqViewerComponent } from './faq-viewer';


@NgModule({
  declarations: [
    ChildSummaryComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // Standalone components
    DrillSelectorComponent,
    SelectionSummaryComponent,
    OptionsPanelComponent,
    FaqViewerComponent
  ],
  exports: [
    ChildSummaryComponent,
    // Standalone components
    DrillSelectorComponent,
    SelectionSummaryComponent,
    OptionsPanelComponent,
    FaqViewerComponent
  ]
})
export class CoreComponentsModule { }
