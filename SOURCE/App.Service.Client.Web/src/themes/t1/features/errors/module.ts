import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Core modules
import { BaseCoreAgPipesModule } from '../../../../core.ag/pipes/module';

// Modules:
import { BaseThemesV1ErrorsRoutingModule } from "./routing";

// Legacy Components (kept for backwards compatibility)
import { BaseErrors404BasicComponent } from './404/basic/component';
import { BaseErrors500TodoComponent } from './500/component';
import { BaseErrorsOfflineComponent } from './000/offline/component';
import { BaseErrorsAccountNotFoundComponent } from './404/account-not-found/component';

// NEW: Parameterized error components
import { ErrorPageBasicComponent } from './_parameterized/basic/component';
import { ErrorPageCoverComponent } from './_parameterized/cover/component';
import { ErrorPageAltComponent } from './_parameterized/alt/component';

import { BaseThemesModule } from '../../../module';
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';

@NgModule({
  declarations: [
    // Legacy Components (kept for backwards compatibility)
    BaseErrors404BasicComponent,
    BaseErrorsOfflineComponent,
    BaseErrors500TodoComponent,
    BaseErrorsAccountNotFoundComponent,
    
    // NEW: Parameterized error components
    ErrorPageBasicComponent,
    ErrorPageCoverComponent,
    ErrorPageAltComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    RouterModule,
    BaseCoreAgPipesModule,
    // Import upstream:
    BaseThemesModule,
    // Routes:
    BaseThemesV1ErrorsRoutingModule,
  ],
  exports: [
    // Legacy Declarations:
    BaseErrors404BasicComponent,
    BaseErrorsOfflineComponent,
    BaseErrors500TodoComponent,
    BaseErrorsAccountNotFoundComponent,
    
    // NEW: Parameterized error components
    ErrorPageBasicComponent,
    ErrorPageCoverComponent,
    ErrorPageAltComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow custom web components (lord-icon)
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
