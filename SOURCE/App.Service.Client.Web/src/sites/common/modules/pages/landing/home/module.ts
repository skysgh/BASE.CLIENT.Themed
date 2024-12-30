// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Etc:
import { TranslateModule } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';

// Etc:
//import { JsonFormsModule } from '@jsonforms/angular';
//import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';//Import template:

//import { BaseCoreCommonComponentsBreadcrumbsComponent } from '../../modules/components/components/breadcrumbs/component';

import { BaseAppsPagesInformationIndexComponent } from './components/component';
// Import  Base.Common.Models:

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../../../../../app/unsure/shared/module';
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { NgbAccordionModule, NgbCarouselModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CountUpModule } from 'ngx-countup';
import { BaseCoreCommonModule } from '../../../common/module';
// import { BaseCoreCommonComponentsModule } from '../../../common/components/module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { BaseCoreHomeRoutingModule } from './routes';
import { BaseCoreLandingSharedPartsModule } from '../_sharedparts/module';
//NO: import { ScrollspyDirective } from '../../common/scrollspy.directive';
//import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
  imports: [
    TranslateModule.forChild(),
    BaseCoreHomeRoutingModule,
    // Import classes within the above specified import files.
    //Ag specific:
    CommonModule,
    FormsModule,
    SharedModule,
    BaseCoreCommonModule,
    BaseCoreLandingSharedPartsModule,
    // Module specific:
    //ScrollToModule,
    //SlickCarouselModule,
    //NgbNavModule,
    NgbCarouselModule,
    NgbAccordionModule,
    //NgbDropdownModule,
    //CountUpModule,
    BaseCoreCommonModule,
    // BaseCoreCommonComponentsModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SlickCarouselModule,
    CountUpModule,
    //WidgetLibraryModule // Include WidgetLibraryModule here
  //  LandingScrollspyDirective,
    //  ScrollspyDirective
  ScrollToModule.forRoot()
  ],
  exports: [
    //NO:ScrollspyDirective,
    //NO?:SlickCarouselModule ,
    // Not sure why doing this:
    RouterModule,
  ],
  declarations: [
    //NO: ScrollspyDirective,
    // define what Components belong to this Module (i.e., are not `standalone`)
    BaseAppsPagesInformationIndexComponent,
  ],
  providers: [
    // declare services to dependency inject into constructors.
  ]
})
export class BaseCoreHomeModule {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }
}
