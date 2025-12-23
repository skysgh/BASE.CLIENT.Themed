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
// NO: Parent MOdule:
// NO: import { BaseThemesV1UnusedFeaturesModule } from '../module';

// Components:
import { CryptoStatComponent } from './crypto-stat/crypto-stat.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { TopPerformersComponent } from './top-performers/top-performers.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    CryptoStatComponent,
    CurrenciesComponent,
    NewsFeedComponent,
    TopPerformersComponent
  ],
  providers: [],
  imports: [
    // Ag:
    CommonModule,
    // Misc:
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
    // Declared components:
    CryptoStatComponent,
    CurrenciesComponent,
    NewsFeedComponent,
    TopPerformersComponent
  ]
})
export class BaseThemesV1UnusedFeatures2CryptoModule { }
