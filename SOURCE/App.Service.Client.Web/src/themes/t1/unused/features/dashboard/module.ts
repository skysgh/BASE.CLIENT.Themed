// Rx:

// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Misc:
import { NgbTooltipModule, NgbProgressbarModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// 
import { CountUpModule } from 'ngx-countup';
// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';
// NO: Parent Module:
// NO: import { BaseThemesV1UnusedFeaturesModule } from '../module';

// Components:
import { BestSellingComponent } from './best-selling/best-selling.component';
import { TopSellingComponent } from './top-selling/top-selling.component';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { StatComponent } from './stat/stat.component';


@NgModule({
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    NgbDropdownModule,
    CountUpModule,
    FeatherModule.pick(allIcons),
    NgApexchartsModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1UnusedFeaturesModule
    // N/A since unused.
    // Child Modules:
    // N/A
    //
  ],
  declarations: [
    BestSellingComponent,
    RecentOrdersComponent,
    StatComponent,
    TopSellingComponent

  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1UnusedFeaturesModule,
    // Declared components:
    BestSellingComponent,
    RecentOrdersComponent,
    StatComponent,
    TopSellingComponent
  ],
  providers: []
})
export class BaseThemesV1UnusedFeatures2DashboardModule { }
