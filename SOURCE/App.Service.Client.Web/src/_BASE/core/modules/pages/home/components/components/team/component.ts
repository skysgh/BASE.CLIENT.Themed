// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../services/system.diagnostics-trace.service';
import { ServiceDeliveryTeamMemberRepositoryService } from '../../../../../../services/services/repositories/service-delivery-team-members.repository.service';
// Models
import { ServiceDeliveryTeamMemberVTO } from '../../../../../../models/view/service-delivery-team-member.vto.model';
// Data:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';

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

  team$: Observable<ServiceDeliveryTeamMemberVTO[]> = of([]);

  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;
  sectionsInfo = importedSectionsInfo;
  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translateService: TranslateService,
    protected systemTeamRepositoryService :ServiceDeliveryTeamMemberRepositoryService  ) {
    // Make system/env variables avaiable to view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)


    // Make system/env variables avaiable to view template:
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
