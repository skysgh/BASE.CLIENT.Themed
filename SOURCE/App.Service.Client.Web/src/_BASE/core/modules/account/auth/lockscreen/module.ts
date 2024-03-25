import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { LockScreenRoutingModule } from "./routing";
import { BasicComponent } from './basic/component';
import { CoverComponent } from './cover/component';
import { TranslateModule } from '@ngx-translate/core';
import { BaseCoreCommonComponentsModule } from '../../../common/components/module';

@NgModule({
  declarations: [
    BasicComponent,
    CoverComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    BaseCoreCommonComponentsModule,

    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    LockScreenRoutingModule
  ]
})
export class LockscreenModule { }
