import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { BaseThemesV1FeaturesPassCreateRoutingModule } from "./routing";
import { BasicComponent } from './basic/component';
import { CoverComponent } from './cover/component';
import { BaseThemesV1Module } from '../../../../../module';
import { BaseCoreAgModule } from '../../../../../../../core.ag/module';
import { BaseThemesModule } from '../../../../../../module';

// NO: Parent Module:
// import { BaseThemesV1FeaturesUserAccountModule } from '../../module';
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
    //Can Remove: TranslateModule.forChild(),
    CommonModule,
    //
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    // Routes:
    BaseThemesV1FeaturesPassCreateRoutingModule,

    // Import upstream:
    BaseThemesModule,

    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule
    // Child Modules:
    // N/A
  ],
  exports: [
    // NO: Export Parent Module:
    // BaseThemesV1FeaturesUserAccountModule
  ]
})
export class BaseThemesV1FeaturesPassCreateModule { 
  
}
