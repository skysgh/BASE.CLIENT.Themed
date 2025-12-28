// Rx:
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ServiceEndorsementService } from '../../../../../../../core/services/service-endorsement.service';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-core-pages-landing-index-review',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Review Component
 * 
 * ✅ Updated to use modern ServiceEndorsementService with signals
 */
export class BaseAppsPagesLandingIndexReviewComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  sectionsInfo = importedSectionsInfo;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public endorsementService: ServiceEndorsementService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
    // Endorsements automatically loaded by service
    // Access via endorsementService.enabledEndorsements() signal
  }

  /**
   * Swiper Responsive setting
   */
  public review = {
    initialSlide: 0,
    slidesPerView: 1,
    pagination: true,
    navigation: true
  };
}
