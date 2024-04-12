// Ag:
import { Component, OnInit } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../services/system.diagnostics-trace.service';
import { SystemEndorsementRepositoryService } from '../../../../../../services/services/repositories/service-endorsements.repository.service';
// Models:
import { Observable, of } from 'rxjs';
import { ServiceEndorsementMAYBE } from '../../../../../../models/data/service-endorsement.model';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';


@Component({
  selector: 'app-base-core-pages-landing-index-review',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Review Component
 */
export class BaseAppsPagesLandingIndexReviewComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  sectionsInfo = importedSectionsInfo;


  reviews$: Observable<ServiceEndorsementMAYBE[]> = of([]);

  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translateService: TranslateService,
    private systemEndorsementRepositoryService: SystemEndorsementRepositoryService
) {
    // Make system/env variables avaiable to class & view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
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
