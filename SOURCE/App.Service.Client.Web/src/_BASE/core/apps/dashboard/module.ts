// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//
import { DiagnosticsService } from '../../../shared/services/diagnostics.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
//
import { StatComponent } from './ui/stat/component';
import { DashboardComponent } from './ui/component';

//import Module specific:
@NgModule({
  imports: [
      RouterModule.forChild(
        [
          {
            path: '', component: DashboardComponent
          }
        ]),
          // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    // Module specific:
    // No components
  ],

  declarations: [
    StatComponent,
    DashboardComponent,
  ],
  providers: [
    // declare services to dependency inject into constructors.
    // define what Services
    //DiagnosticsService,
    DashboardService,
  ]
})
export class AppsDashboardModule { }
