// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//
import { BaseCoreDashboardsIndexComponent } from './components/index/component';
import { BaseCoreCommonComponentsModule } from '../common/components/module';
import { BaseCoreDashboardsRouterModule } from './routes';
import { DashboardService } from '../../services/service.dashboard.service';
import { BaseCoreCommonModule } from '../common/module';
//
//import { StatComponent } from './hold/stat/component';
//import { DashboardComponent } from './ui/component';

//import Module specific:
@NgModule({
  imports: [
    // Import classes within the above specified import files.
    // Ag specific:
    CommonModule,
    BaseCoreCommonModule,
    // Module specific:
    BaseCoreCommonComponentsModule,
    // Routes
    BaseCoreDashboardsRouterModule,
  ],

  declarations: [
    BaseCoreDashboardsIndexComponent,
  ],
  providers: [
    // declare services to dependency inject into constructors.
    // define what Services
    //DiagnosticsTraceService,
    DashboardService
  ]
})
export class BaseCoreDashboardsModule { }
