import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

//Can Remove: import { TranslateModule } from '@ngx-translate/core';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// MOdules:
import { BaseThemesV1ErrorsRoutingModule } from "./routing";
// Component
import { BaseErrors404BasicComponent } from './404/basic/component';
import { BaseErrors404CoverComponent } from './404/cover/component';
import { BaseErrors404AltComponent } from './404/alt/component';
import { BaseErrors500TodoComponent } from './500/component';
import { BaseErrorsOfflineComponent } from './000/offline/component';
import { BaseThemesModule } from '../../../module';
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';

// NO: Parent Module:
// NO: import { BaseThemesV1FeaturesModule } from '../module';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseErrors404BasicComponent,
    BaseErrors404CoverComponent,
    BaseErrors404AltComponent,
    BaseErrorsOfflineComponent,
    BaseErrors500TodoComponent
  ],
  providers: [

  ],
  imports: [
    // Ag:
    //Can Remove: TranslateModule.forChild(),
    CommonModule,
    // Import upstream:
    BaseThemesModule,
    // Misc:
    // Routes:
    BaseThemesV1ErrorsRoutingModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1FeaturesModule,
    // Child Modules:
    // N/A
  ],
  exports: [
    // NO: Export Parent Module:
    // NO: BaseThemesV1FeaturesModule,
    // Declarations:
    BaseErrors404BasicComponent,
    BaseErrors404CoverComponent,
    BaseErrors404AltComponent,
    BaseErrorsOfflineComponent,
    BaseErrors500TodoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow custom web components
})
export class BaseThemesV1FeaturesErrorsModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  constructor(private defaultControllerServices: DefaultComponentServices  ) {

    this.defaultControllerServices.translationService.initialiseTranslatorsCurrentLanguage();

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);

    defineElement(lottie.loadAnimation);
  }
}
