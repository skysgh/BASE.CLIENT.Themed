import { Component, OnInit } from '@angular/core';

import {servicesModel} from './services.model';
import { Services } from './data';
import { SystemService } from '../../../../../services/system.service';
import { TranslateService } from '@ngx-translate/core';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { System } from '../../../../../constants/contracts/system';
import { CapabilitiesVTO } from '../../../../../models/view/base-capabilities';
import { Observable, of } from 'rxjs';
import { SystemCapabilitiesRepositoryService } from '../../../../../services/repositories/system-capabilities.service';


@Component({
  selector: 'app-base-core-pages-landing-index-capabilities',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Services Component
 */
export class BaseAppsPagesLandingIndexCapabilitiesComponent implements OnInit {


  capabilities$: Observable<CapabilitiesVTO[]> = of([]);

  system: System;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService,
    protected capabilitiesRepositoryService: SystemCapabilitiesRepositoryService
    ) {
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
