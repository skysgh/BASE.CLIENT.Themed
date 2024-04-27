// Ag:
import { Component, OnInit } from '@angular/core';
// Translate:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../services/system.diagnostics-trace.service';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { Observable, of } from 'rxjs';
import { ServiceFeature } from '../../../../../../models/data/service-features.model';
import { ServiceFeaturesService } from '../../../../../../services/services/service-features.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index-designed',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Designed Component
 */
export class BaseAppsPagesLandingIndexDesignedComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  public features$: Observable<ServiceFeature[]> = of([]);

  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translateService: TranslateService,
    protected serviceFeaturesService: ServiceFeaturesService) {
    // Make system/env variables avaiable to class & view template:
    this.system = systemService.system;


    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    this._fetchData();

  } 

  ngOnInit(): void {
  }

  // Chat Data Fetch
  private _fetchData() {
    this.features$ = this.serviceFeaturesService.items$;
  }

}
