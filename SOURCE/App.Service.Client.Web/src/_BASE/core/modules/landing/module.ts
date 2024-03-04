import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/component';

import {
  NgbCarouselModule, NgbTooltipModule, NgbCollapseModule
} from '@ng-bootstrap/ng-bootstrap';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { LandingRoutingModule } from "./routing.module";
import { SharedModule } from '../../../../app/shared/shared.module';
import { JobComponent } from './job/component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    IndexComponent,
    JobComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgbCarouselModule,
    LandingRoutingModule,
    SharedModule,
    NgbTooltipModule,
    NgbCollapseModule,
    ScrollToModule.forRoot(),
  ]
})
export class BaseCoreLandingModule { }
