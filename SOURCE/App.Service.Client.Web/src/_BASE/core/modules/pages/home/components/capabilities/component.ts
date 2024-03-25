import { Component, OnInit } from '@angular/core';

import {servicesModel} from './services.model';
import { Services } from './data';
import { SystemService } from '../../../../../services/system.service';
import { TranslateService } from '@ngx-translate/core';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { System } from '../../../../../constants/contracts/system';


@Component({
  selector: 'app-base-core-pages-landing-index-capabilities',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Services Component
 */
export class BaseAppsPagesLandingIndexCapabilitiesComponent implements OnInit {

  Services!: servicesModel[];

  system: System;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService) {
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
      this.Services = Services;
    }

}
