// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
import { ServiceDeliveryTeamMemberRepositoryService } from '../../../../../../../../core/services/services/repositories/service-delivery-team-members.repository.service';
// Models
import { ServiceDeliveryTeamMemberVTO } from '../../../../../../../../core/models/view/service-delivery-team-member.vto.model';
// Data:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';

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

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

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
