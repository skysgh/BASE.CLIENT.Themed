// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { SystemService } from '../../../../../../services/system.service';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';//
// Services:
import { DiagnosticsTraceService } from '../../../../../../services/diagnostics.service';
import { SystemCapabilitiesVTO } from '../../../../../../models/view/base-capabilities';
import { SystemCapabilitiesRepositoryService } from '../../../../../../services/repositories/system-capabilities.service';
// Models:
import { servicesModel } from './services.model';
import { Services } from './data';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';


@Component({
  selector: 'app-base-core-pages-landing-index-capabilities',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Services Component
 */
export class BaseAppsPagesLandingIndexCapabilitiesComponent implements OnInit {


  capabilities$: Observable<SystemCapabilitiesVTO[]> = of([]);

  // Make system/env variables avaiable to view template:
  system = importedSystemConst;
  sectionsInfo = importedSectionsInfo;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService,
    protected capabilitiesRepositoryService: SystemCapabilitiesRepositoryService
    ) {
    // Make system/env variables avaiable to view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    /**
     * fetches data
     */
     this._fetchData();
  }

   /**
 * User grid data fetches
 */
  private _fetchData() {
    this.capabilitiesRepositoryService
      .getPage()
      .subscribe(x => {
        this.capabilities$ = of(x)
      });
    }

}
