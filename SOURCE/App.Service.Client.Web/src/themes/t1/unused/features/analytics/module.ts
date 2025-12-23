// Ag:
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// NO: Parent Module:
// NO: import { BaseThemesV1UnusedFeaturesModule } from "../module";
// Components:
import { AnalyticsStatComponent } from "./analytics-stat/analytics-stat.component";
import { TopPagesComponent } from "./top-pages/top-pages.component";


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    AnalyticsStatComponent,
    TopPagesComponent,
  ],
  providers: [],
  imports: [
    CommonModule,

    // Supporting:
    //NgbTooltipModule,
    //NgbProgressbarModule,
    //NgbDropdownModule,
    //CountUpModule,
    //FeatherModule.pick(allIcons),
    //NgApexchartsModule,

    // NO: Import Parent Module:
    // NO: BaseThemesV1UnusedFeaturesModule,
    // N/A since unused.
    // Child Modules:
    // N/A
    //
  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1UnusedFeaturesModule,
    // Declared Components:
    AnalyticsStatComponent,
    TopPagesComponent,
  ]
})
export class BaseThemesV1UnusedFeatures2AnalyticsModule { }
