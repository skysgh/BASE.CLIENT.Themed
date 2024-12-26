// Ag:
import { Component, OnInit } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
import { SystemEndorsementRepositoryService } from '../../../../../../../../core/services/services/repositories/service-endorsements.repository.service';
// Models:
import { Observable, of } from 'rxjs';
import { ServiceEndorsementMAYBE } from '../../../../../../../../core/models/data/service-endorsement.model';
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
 */
export class BaseAppsPagesLandingIndexReviewComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

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
