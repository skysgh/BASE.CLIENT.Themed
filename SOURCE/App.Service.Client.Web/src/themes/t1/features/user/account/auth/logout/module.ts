import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Component
import { BaseThemesV1FeaturesLogoutRoutingModule } from './routing';
import { BasicComponent } from './basic/component';
import { CoverComponent } from './cover/component';
import { BaseCoreAgPipesModule } from '../../../../../../../core.ag/pipes/module';
import { BaseThemesV1Module } from '../../../../../module';
import { BaseCoreAgModule } from '../../../../../../../core.ag/module';
import { BaseThemesModule } from '../../../../../../module';
//Can Remove: import { TranslateModule } from '@ngx-translate/core';
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
    // Routes:
    BaseThemesV1FeaturesLogoutRoutingModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule
    // Child Modules:
    // N/A
  ],
  exports: [
    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow custom web components
})
export class BaseThemesV1FeaturesLogoutModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
