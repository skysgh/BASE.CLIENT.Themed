import { Component, OnInit } from '@angular/core';

import {TeamModel} from './team.model';
import { Teams } from './data';
import { System } from '../../../../../constants/contracts/system';
import { SystemService } from '../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemTeamRepositoryService } from '../../../../../services/repositories/system-team.service';
import { TeamVTO } from '../../../../../models/view/team.vto';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-base-core-pages-landing-index-team',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Team Component
 */
export class BaseAppsPagesLandingIndexTeamComponent implements OnInit {

  //Teams!: TeamModel[];

  team$: Observable<TeamVTO[]> = of([]);

  system: System;
  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService,
    protected systemTeamRepositoryService :SystemTeamRepositoryService  ) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)


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

    this.systemTeamRepositoryService
      .getPage(1)
      .subscribe(x => this.team$ = of(x));

    //this.Teams = Teams;
  }

}
