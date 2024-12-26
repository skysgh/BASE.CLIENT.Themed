import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { SigninRoutingModule } from './routing';
import { BasicComponent } from './basic/component';
import { CoverComponent } from './cover/component';
import { TranslateModule } from '@ngx-translate/core';

// import { BaseCoreCommonComponentsModule } from '../../../common/components/module';
import { BaseCoreCommonModule } from '../../../common/module';

//import { BaseTranslatePipe } from '../../../common/pipes/basetranslate.pipe';

@NgModule({
  declarations: [
    BasicComponent,
    CoverComponent
    //BaseTranslatePipe
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),

    BaseCoreCommonModule,
    // BaseCoreCommonComponentsModule,

    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,

    SigninRoutingModule
  ],
  exports: [
    //BaseTranslatePipe
  ]
})
export class SigninModule { }
