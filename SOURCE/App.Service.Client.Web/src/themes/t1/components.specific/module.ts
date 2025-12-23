// Rx:
//
// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Etc:
//Can Remove: import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// Bootstrap:
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
// Configuration:
import { appsConfiguration } from '../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../core/services/default-controller-services';
// Models:
//
// Data:
//
// Modules:
import { BaseCoreAgComponentsModule } from '../../../core.ag/components.default/module';
import { BaseThemesV1PipesModule } from '../pipes/module';
// NO: Parent Module:
// NO: import { BaseThemesV1Module } from '../module';
// Child Modules:
//
// Components:
//

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    // define what Components belong to this Module (i.e., are not `standalone`)
  ],
  providers: [
    // N/A
  ],
  imports: [
    // Ag:
    CommonModule,
    RouterModule,
    // Misc:
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    // Dependencies:
    MarkdownModule.forChild(),
    PdfViewerModule,

    // Sideways:
    BaseCoreAgComponentsModule,

    BaseThemesV1PipesModule,

    // NO: Import Parent Module:
    // NO: BaseThemesV1Module
    // Child Modules:
    // WARNING:
    // Do *not* import all Child Component Modules
    // or a child module that imports its Parent will
    // pull in all other specific childen.
    // ie: it defeats the purpose of
    // NOT pulling in every heavy component+lib.
    // when only one is needed.
  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1Module
    // Child Modules:
    // WARNING:
    // Do *not* import all Child Component Modules
    // or a child module that imports its Parent will
    // pull in all other specific childen.
    // ie: it defeats the purpose of
    // NOT pulling in every heavy component+lib.
    // when only one is needed.
    // Declarations:
    // ...not yet...
  ]
})
export class BaseThemesV1ComponentsSpecificModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  constructor(
    private defaultComponentServices: DefaultComponentServices) {
    this.defaultComponentServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
  }

}
