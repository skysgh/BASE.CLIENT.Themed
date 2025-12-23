import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { BaseThemesV1FeaturesLockScreenRoutingModule } from "./routing";
import { BasicComponent } from './basic/component';
import { CoverComponent } from './cover/component';
import { BaseCoreAgPipesModule } from '../../../../../../../core.ag/pipes/module';
import { BaseThemesV1Module } from '../../../../../module';
import { BaseCoreAgModule } from '../../../../../../../core.ag/module';
import { BaseThemesModule } from '../../../../../../module';
//Can Remove: import { TranslateModule } from '@ngx-translate/core';
// import { BaseCoreCommonComponentsModule } from '../../../common/components/module';

// NO: Parent Module:
// import { BaseThemesV1FeaturesUserAccountModule } from '../../module';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BasicComponent,
    CoverComponent
  ],
  providers: [

  ],
  imports: [
    CommonModule,
    //Can Remove: TranslateModule.forChild(),

    // Import upstream:
    BaseThemesModule,

    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    // Routing:
    BaseThemesV1FeaturesLockScreenRoutingModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule
    // Child Modules:
    // N/A
  ],
  exports: [
    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule

  ]
})
export class BaseThemesV1FeaturesLockscreenModule { }
