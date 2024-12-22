import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponent } from './basic/component';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { SignupRoutingModule } from './routing';
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
    SignupRoutingModule
  ]
})
export class SignupModule { }
