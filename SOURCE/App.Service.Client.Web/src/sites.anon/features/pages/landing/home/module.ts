// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Etc:
//Can Remove: import { TranslateModule } from '@ngx-translate/core';
// Constants:
//
// Etc:
//import { JsonFormsModule } from '@jsonforms/angular';
//import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';//Import template:

//import { BaseCoreCommonComponentsBreadcrumbsComponent } from '../../modules/components/components/breadcrumbs/component';

import { BaseAppsPagesHomeIndexComponent } from './ui/views/home-index/component';
// Import  Base.Common.Models:

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
import { NgbAccordionModule, NgbCarouselModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpModule } from 'ngx-countup';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
//NO: import { ScrollspyDirective } from '../../common/scrollspy.directive';
//import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

// Dependencies:
import { BaseThemesV1Module } from '../../../../../themes/t1/module';
// Child Modules:
import { BaseCoreHomeRoutingModule } from './routes';
import { BaseCoreLandingSharedPartsModule } from '../_sharedparts/module';
// NO: Parent Module:
// NO: import { BaseCorePagesLandingModule } from '../module';


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    //NO: ScrollspyDirective,
    BaseAppsPagesHomeIndexComponent,
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ],
  imports: [
    //Can Remove: TranslateModule.forChild(),
    BaseCoreHomeRoutingModule,
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    BaseThemesV1Module,
    BaseCoreLandingSharedPartsModule,
    // Module specific:
    //ScrollToModule,
    //SlickCarouselModule,
    //NgbNavModule,
    NgbCarouselModule,
    NgbAccordionModule,
    //NgbDropdownModule,
    //CountUpModule,
    // BaseCoreCommonComponentsModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SlickCarouselModule,
    CountUpModule,
    //WidgetLibraryModule // Include WidgetLibraryModule here
  //  LandingScrollspyDirective,
    //  ScrollspyDirective
    //ScrollToModule.forRoot(),
    // NO: Import Parent Module:
    // NO: BaseCorePagesLandingModule,
  ],
  exports: [
    //NO:ScrollspyDirective,
    //NO?:SlickCarouselModule ,
    // Not sure why doing this:
    RouterModule,
    // NO: Export Parent Module
    // NO: BaseCorePagesLandingModule
  ]
})
export class BaseCoreHomeModule {
  // Make system/env variables avaiable to class & view template:

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }
}
