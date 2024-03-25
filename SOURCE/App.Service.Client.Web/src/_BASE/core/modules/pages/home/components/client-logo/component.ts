import { Component, OnInit } from '@angular/core';

import {clientLogoModel} from './client-logo.model';
import { ClientLogo } from './data';
import { TranslateService } from '@ngx-translate/core';
import { SystemService } from '../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { System } from '../../../../../constants/contracts/system';

@Component({
  selector: 'app-base-core-pages-landing-index-client-logo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * ClientLogoComponent
 */
export class BaseAppsPagesLandingIndexClientLogoComponent implements OnInit {

  system: System;

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ClientLogo!: clientLogoModel[];

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
  public Responsive= {
    infinite: true,
    slidesToShow: 4,
    autoplay: true,
    dots: true,
    arrows: false
  };


}
