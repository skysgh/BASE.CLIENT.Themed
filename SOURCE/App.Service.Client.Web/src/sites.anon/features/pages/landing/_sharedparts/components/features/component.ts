// Rx:
//
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';
import { TranslationService } from '../../../../../../../core/services/translation.service';

@Component({
  selector: 'app-base-core-pages-landing-index-features',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Collection Component
 * 
 * ✅ ARCHITECTURAL FIX - Removed Upward Coupling
 * Removed direct appsConfiguration import (upward coupling to Apps tier)
 * Component now only references sitesConfiguration (same tier)
 */
export class BaseAppsPagesLandingIndexFeaturesComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public translationService: TranslationService) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }


  ngOnInit(): void {
  }

}
