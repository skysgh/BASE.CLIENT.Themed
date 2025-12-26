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
import { BaseThemesV1Module } from '../../../../../module';
import { BaseCoreAgModule } from '../../../../../../../core.ag/module';
import { BaseThemesModule } from '../../../../../../module';
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../../configuration/implementations/themes.t1.configuration';

// NO: Parent Module:
// NO: import { BaseThemesV1FeaturesUserAccountModule } from '../../module';
//Can Remove: import { TranslateModule } from '@ngx-translate/core';

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
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,

    // Import upstream:
    BaseThemesModule,

    // Routes:
    PassResetRoutingModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule
    // Child Modules:
    // N/A
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseThemesV1FeaturesUserAccountModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow custom web components
})
export class BaseThemesV1FeaturesPassResetModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
