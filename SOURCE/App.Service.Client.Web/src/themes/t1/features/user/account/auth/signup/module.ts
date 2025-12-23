import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponent } from './basic/component';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { BaseThemesV1FeaturesSignupRoutingModule } from './routing';
import { CoverComponent } from './cover/component';
import { BaseCoreAgPipesModule } from '../../../../../../../core.ag/pipes/module';
import { BaseThemesV1Module } from '../../../../../module';
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
    BaseCoreAgPipesModule,
    //Can Remove: TranslateModule.forChild(),
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,

    // Import upstream:
    BaseThemesModule,

    BaseThemesV1FeaturesSignupRoutingModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule
    // Child Modules:
    // N/A
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule
  ]
})
export class BaseThemesV1FeaturesSignupModule { }
