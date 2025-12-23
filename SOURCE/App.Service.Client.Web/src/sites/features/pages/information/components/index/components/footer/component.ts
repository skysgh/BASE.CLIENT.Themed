// Ag:
import { Component, OnInit } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { appsConfiguration } from '../../../../../../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../../configuration/implementation/sites.configuration';
// Services:
//import { SystemService } from '../../../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
import { ViewModel } from './vm';
import { TranslationService } from '../../../../../../../../core/services/translation.service';
// Data/Models:
//import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';


@Component({
  selector: 'app-base-common-components-footer-ooo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 * 
 * TODO: ARCHITECTURAL DEBT - Resource Path Coupling
 * This component uses appsConfiguration.constants.resources which creates upward coupling.
 * Sites tier should NOT reference Apps tier directly.
 * 
 * Current: appsConfiguration.constants.resources.open.images.logos (upward coupling)
 * Proper: Inject RESOURCE_PATHS token or ResourceService (DI abstraction)
 * 
 * See: _custom/documentation/roadmaps/architectural-recovery-plan.md Phase 3.3
 * See: _custom/documentation/roadmaps/library-extraction-roadmap.md Phase 1.4
 * 
 * Impact: Blocks library extraction, creates tight coupling
 * Fix Priority: Phase 3 (after Phase 0 logo 404s resolved)
 */
export class BaseAppsPagesLandingIndexFooterComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration


  vm = new ViewModel(appsConfiguration);

  //var t3 = appsConfiguration.copyrights.year
  //var test = appsConfiguration.navigation.messages;
  //var test = appsConfiguration.navigation.tasks;
  //var test = appsConfiguration.navigation.schedules;
  //var t1 = appsConfiguration.constants.resources.open.images.logos;

  constructor(
    //systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translationService: TranslationService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
  }

}
