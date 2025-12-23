import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// otp module
import { NgOtpInputModule } from 'ng-otp-input';

// Component
import { BaseThemesV1FeaturesTwoStepRoutingModule } from "./routing";
import { BasicComponent } from './basic/component';
import { CoverComponent } from './cover/component';
import { BaseThemesV1Module } from '../../../../../module';
import { BaseCoreAgPipesModule } from '../../../../../../../core.ag/pipes/module';
import { BaseCoreAgModule } from '../../../../../../../core.ag/module';
import { BaseThemesModule } from '../../../../../../module';
// NO: Parent Module:
// NO: import { BaseThemesV1FeaturesUserAccountModule } from '../../module';
//Can Remove: import { TranslateModule } from '@ngx-translate/core';
// import { BaseCoreCommonComponentsModule } from '../../../common/components/module';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BasicComponent,
    CoverComponent
  ],
  providers:[],
  imports: [
    CommonModule,
    //Can Remove: TranslateModule.forChild(),
    BaseCoreAgPipesModule,
    BaseThemesV1Module,
    // BaseCoreCommonComponentsModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,

    // Import upstream:
    BaseThemesModule,

    // Routes:
    BaseThemesV1FeaturesTwoStepRoutingModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule,
    // Child Modules:
    // N/A
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule
    BasicComponent,
    CoverComponent
  ]
})
export class BaseThemesV1FeaturesTwostepModule { }
