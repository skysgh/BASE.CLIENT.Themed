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

// NO: Parent Modules:
// NO: import { BaseThemesV1UnusedFeaturesModule } from '../module';

// Components:
import { CrmStatComponent } from './crm-stat/crm-stat.component';
import { DealsStatusComponent } from './deals-status/deals-status.component';
import { UpcomingActivitiesComponent } from './upcoming-activities/upcoming-activities.component';
import { ClosingDealsComponent } from './closing-deals/closing-deals.component';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    ClosingDealsComponent,
    CrmStatComponent,
    DealsStatusComponent,
    UpcomingActivitiesComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    //
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
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1UnusedFeaturesModule,
    // Declared Components:
    ClosingDealsComponent,
    CrmStatComponent,
    DealsStatusComponent,
    UpcomingActivitiesComponent
  ]
})
export class BaseThemesV1UnusedFeatures2CrmModule { }
