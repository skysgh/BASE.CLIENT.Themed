// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { SystemEndorsementRepositoryService } from '../../../../../../../core/services/services/repositories/service-endorsements.repository.service';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';
import { ServiceEndorsementMAYBE } from '../../../../../../../core/models/data/service-endorsement.model';


@Component({
  selector: 'app-base-core-pages-landing-index-review',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Review Component
 * 
 * ✅ ARCHITECTURAL FIX - Removed Upward Coupling
 * Removed direct appsConfiguration import (upward coupling to Apps tier)
 * Component now only references sitesConfiguration (same tier)
 */
export class BaseAppsPagesLandingIndexReviewComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;


  reviews$: Observable<ServiceEndorsementMAYBE[]> = of([]);

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private systemEndorsementRepositoryService: SystemEndorsementRepositoryService
) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
    /**
     * fetches data
     */
    //this._fetchData();

    this.systemEndorsementRepositoryService.getPage().subscribe(x => {
      this.reviews$ = of(x);
    });
  }

   /**
 * User grid data fetches
 */
    //private _fetchData() {
    //  this.ClientLogo = ClientLogo;
    //}

  /**
   * Swiper Responsive setting
   */
  public review= {
    initialSlide: 0,
    slidesPerView: 1,
    pagination: true,
    navigation: true
  };

}
