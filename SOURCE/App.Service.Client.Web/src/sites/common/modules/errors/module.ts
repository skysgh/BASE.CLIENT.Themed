import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Services:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
// MOdules:
import { TranslateModule } from '@ngx-translate/core';
import { AppBaseErrorsRoutingModule } from "./routing";
// Component
import { BaseErrors404BasicComponent } from './404/basic/component';
import { BaseErrors404CoverComponent } from './404/cover/component';
import { BaseErrors404AltComponent } from './404/alt/component';
import { BaseErrors500TodoComponent } from './500/component';
import { BaseErrorsOfflineComponent } from './000/offline/component';
import { TranslationService } from '../../../../core/services/translation.service';
import { BaseCoreCommonModule } from '../common/module';

@NgModule({
  declarations: [
    BaseErrors404BasicComponent,
    BaseErrors404CoverComponent,
    BaseErrors404AltComponent,
    BaseErrorsOfflineComponent,
    BaseErrors500TodoComponent
  ],
  imports: [
    TranslateModule.forChild(),
    CommonModule,
    BaseCoreCommonModule,
    AppBaseErrorsRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppBaseCoreErrorsModule {

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService, private translationService: TranslationService) {

    translationService.initialiseTranslatorsCurrentLanguage();

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);

    defineElement(lottie.loadAnimation);
  }
}
