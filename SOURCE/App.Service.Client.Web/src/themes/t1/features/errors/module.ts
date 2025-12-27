import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Modules:
import { BaseThemesV1ErrorsRoutingModule } from "./routing";
// Components
import { BaseErrors404BasicComponent } from './404/basic/component';
import { BaseErrors500TodoComponent } from './500/component';
import { BaseErrorsOfflineComponent } from './000/offline/component';
import { BaseErrorsAccountNotFoundComponent } from './404/account-not-found/component';
import { BaseThemesModule } from '../../../module';
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    BaseErrors404BasicComponent,
    BaseErrorsOfflineComponent,
    BaseErrors500TodoComponent,
    BaseErrorsAccountNotFoundComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    // Import upstream:
    BaseThemesModule,
    // Routes:
    BaseThemesV1ErrorsRoutingModule,
  ],
  exports: [
    // Declarations:
    BaseErrors404BasicComponent,
    BaseErrorsOfflineComponent,
    BaseErrors500TodoComponent,
    BaseErrorsAccountNotFoundComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow custom web components
})
export class BaseThemesV1FeaturesErrorsModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  constructor(private defaultControllerServices: DefaultComponentServices) {
    this.defaultControllerServices.translationService.initialiseTranslatorsCurrentLanguage();
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    defineElement(lottie.loadAnimation);
  }
}
