// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ServiceDeliveryTeamMemberRepositoryService } from '../../../../../../../core/services/services/repositories/service-delivery-team-members.repository.service';
// Models
import { ServiceDeliveryTeamMemberVTO } from '../../../../../../../core/models/view/service-delivery-team-member.vto.model';
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
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  //Teams!: TeamModel[];

  team$: Observable<ServiceDeliveryTeamMemberVTO[]> = of([]);


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;
  constructor(
    private defaultControllerServices: DefaultComponentServices,
    protected systemTeamRepositoryService :ServiceDeliveryTeamMemberRepositoryService  ) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
    
    //this.appsConfiguration.navigation.settings.
  }

  ngOnInit(): void {
    // TEMPORARY DEBUG - Remove after fixing
    console.log('🔍 Image path being used:', this.appsConfiguration.others.sites.constants.resources.sensitive.images.users);
    console.log('🔍 Full appsConfiguration:', this.appsConfiguration);
    
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
