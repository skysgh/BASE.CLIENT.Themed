import { Component, OnInit } from '@angular/core';

import {discoverModel} from './discover.model';
import { discoverData } from './data';
import { SystemService } from '../../../../../_BASE/shared/services/system.service';
import { System } from '../../../../../_BASE/shared/constants/contracts/system';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})

/**
 * Discover Component
 */
export class DiscoverComponent implements OnInit {

  discoverData!: discoverModel[];

  system: System;
  constructor(systemService:SystemService) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
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
    this.discoverData = discoverData;
  }

  /**
   * Active Toggle navbar
   */
   activeMenu(id:any) {            
    document.querySelector('.heart_icon_'+id)?.classList.toggle('active');
  }

}
