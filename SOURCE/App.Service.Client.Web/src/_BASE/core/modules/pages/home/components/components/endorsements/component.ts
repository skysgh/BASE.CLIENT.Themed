// Ag:
import { Component, OnInit } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../../services/diagnostics.service';
import { SystemEndorsementRepositoryService } from '../../../../../../services/repositories/system-endorsements.repository.service';
// Models:
import { Observable, of } from 'rxjs';
import { SystemEndorsement } from '../../../../../../models/data/systemEndorsement.model';
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


  system = importedSystemConst;
  sectionsInfo = importedSectionsInfo;


  reviews$: Observable<SystemEndorsement[]> = of([]);

  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService,
    private systemEndorsementRepositoryService: SystemEndorsementRepositoryService
) {
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
