import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';

import {
  NgbCarouselModule, NgbTooltipModule, NgbCollapseModule
} from '@ng-bootstrap/ng-bootstrap';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { LandingRoutingModule } from "./landing-routing.module";
import { SharedModule } from '../shared/shared.module';
import { NftComponent } from './nft/nft.component';
import { JobComponent } from './job/job.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    IndexComponent,
    NftComponent,
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
export class LandingModule { }
