import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NgbCarouselModule, NgbTooltipModule, NgbCollapseModule
} from '@ng-bootstrap/ng-bootstrap';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../../app/shared/shared.module';

import { BaseCoreLandingRoutingModule } from "./routing.module";
import { BaseCoreLandingIndexComponent } from './index/component';
import { BaseCoreLandingJobComponent } from './job/component';
import { BaseCoreLandingPricingComponent } from './pricing/component';

@NgModule({
  declarations: [
    BaseCoreLandingIndexComponent,
    BaseCoreLandingPricingComponent,
    BaseCoreLandingJobComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgbCarouselModule,
    BaseCoreLandingRoutingModule,
    SharedModule,
    NgbTooltipModule,
    NgbCollapseModule,
    ScrollToModule.forRoot(),
  ]
})
export class BaseCoreLandingModule { }
