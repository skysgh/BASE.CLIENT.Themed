import { Component, OnInit } from '@angular/core';

import {clientLogoModel} from './review.model';
import { ClientLogo } from './data';
import { SystemService } from '../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { TranslateService } from '@ngx-translate/core';
import { System } from '../../../../../constants/contracts/system';


@Component({
  selector: 'app-base-core-pages-landing-index-review',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Review Component
 */
export class BaseAppsPagesLandingIndexReviewComponent implements OnInit {

  ClientLogo!: clientLogoModel[];

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
      this.ClientLogo = ClientLogo;
    }

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
