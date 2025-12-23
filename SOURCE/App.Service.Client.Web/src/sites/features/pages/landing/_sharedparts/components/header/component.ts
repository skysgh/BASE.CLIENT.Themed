//Rx:
//
// Ag:
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../apps/configuration/implementations/apps.configuration';
import { appsMainConstants } from '../../../../../../../apps.main/constants/implementations/apps.main.constants';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-core-pages-landing-index-header',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Header Component
 * 
 * TODO: ARCHITECTURAL DEBT - Resource Path Coupling
 * This component was updated to use appsMainConstants which creates DIRECT upward coupling.
 * Sites tier should NOT reference Apps.Main tier directly.
 * 
 * Current: appsMainConstants.resources.open.images.logos (WRONG - direct upward coupling)
 * Previous: appsConfiguration.constants.resources (slightly less bad - indirect)
 * Proper: Inject RESOURCE_PATHS token or ResourceService (DI abstraction)
 * 
 * See: _custom/documentation/roadmaps/architectural-recovery-plan.md Phase 3.3
 * See: _custom/documentation/roadmaps/library-extraction-roadmap.md Phase 1.4
 * 
 * Impact: Violates tier architecture, blocks library extraction, tight coupling
 * Fix Priority: Phase 3 (replace with injection token)
 */
export class BaseAppsPagesLandingIndexHeaderComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose Apps.Main constants for logos and main app resources:
  public appsMainConstants = appsMainConstants
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  // CHanging this (by the parent body div wrapper)
  // changes the style of the button.
  @Input()
  sectionId: string = this.sectionsInfo.intro.id;
  
  constructor(
    private defaultControllerServices: DefaultComponentServices) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    // Noting?
  }

  //Button Event Handler:
  public onToggleMenu() {
    document.getElementById('navbarSupportedContent')?.classList.toggle('show');
  }

  // Event handler for window event:
  // tslint:disable-next-line: typedef
  onWindowScroll() {
    const navbar = document.getElementById('navbar');
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
      navbar?.classList.add('is-sticky');
    }
    else {
      navbar?.classList.remove('is-sticky');
    }
  }
}
