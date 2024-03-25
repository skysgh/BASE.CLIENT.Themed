import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { SuccessMsgRoutingModule } from "./routing";
import { CoverComponent } from './cover/component';
import { BasicComponent } from './basic/component';
import { TranslateModule } from '@ngx-translate/core';
import { BaseCoreCommonComponentsModule } from '../../../common/components/module';

@NgModule({
  declarations: [
    CoverComponent,
    BasicComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    BaseCoreCommonComponentsModule,

    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    SuccessMsgRoutingModule
  ]
})
export class SuccessMsgModule { }
