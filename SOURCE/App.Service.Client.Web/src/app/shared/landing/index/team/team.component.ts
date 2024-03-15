import { Component, OnInit } from '@angular/core';

import {TeamModel} from './team.module';
import { Teams } from './data';
import { SystemService } from '../../../../../_BASE/shared/services/system.service';
import { System } from '../../../../../_BASE/shared/constants/contracts/system';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})

/**
 * Team Component
 */
export class TeamComponent implements OnInit {

  Teams!: TeamModel[];

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
    this.Teams = Teams;
  }

}
