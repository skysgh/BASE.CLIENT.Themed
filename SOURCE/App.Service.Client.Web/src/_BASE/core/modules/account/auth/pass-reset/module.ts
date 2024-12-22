import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Component
import { PassResetRoutingModule } from "./routing";
import { BasicComponent } from './basic/component';
import { CoverComponent } from './cover/component';
import { TranslateModule } from '@ngx-translate/core';
import { BaseCoreCommonComponentsModule } from '../../../common/components/module';
import { BaseCoreCommonModule } from '../../../common/module';

@NgModule({
  declarations: [
    BasicComponent,
    CoverComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    BaseCoreCommonModule,
    BaseCoreCommonComponentsModule,

    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    PassResetRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PassResetModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
