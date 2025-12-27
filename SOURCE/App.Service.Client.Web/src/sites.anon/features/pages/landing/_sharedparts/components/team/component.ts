// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit, Inject } from '@angular/core';
// Sites DI Tokens:
import { 
  PRIVATE_NAVIGATION,      // ✅ Private navigation (includes public)
  PrivateNavigationPaths 
} from '../../../../../../tokens';
// Configuration:
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ServiceDeliveryTeamMemberRepositoryService } from '../../../../../../../core/services/services/repositories/service-delivery-team-members.repository.service';
import { ResourceUrlService } from '../../../../../../../core/services/resource-url.service';
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
 * 
 * ✅ FULLY MIGRATED - Resource URL Service Pattern
 * 
 * Architecture:
 * - Uses ResourceUrlService for all image URLs
 * - Service handles dev/prod mode automatically
 * - Ready for signed URLs when API available (Phase 3)
 * 
 * Security:
 * - Team photos are "public" but still tracked
 * - Future: Signed URLs enable instant cleanup when employee leaves
 * - Future: GDPR compliance via access revocation
 * 
 * Benefits:
 * ✅ Single source of truth for resource URLs
 * ✅ Environment-aware (dev vs prod)
 * ✅ Easy to test (mock the service)
 * ✅ Ready for production (just implement API endpoint)
 * 
 * See: core/services/resource-url.service.ts
 * See: _custom/documentation/architecture/resource-signatures-strategy.md
 */
export class BaseAppsPagesLandingIndexTeamComponent implements OnInit {
  // ⚠️ PARTIAL: Still uses appsConfiguration for some settings
  // TODO: Create APP_CONTEXT token for sponsor/developer info
  public appsConfiguration = appsConfiguration
  
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // ✅ Injected PRIVATE navigation (includes public via .public)
  public nav!: PrivateNavigationPaths;

  team$: Observable<ServiceDeliveryTeamMemberVTO[]> = of([]);

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;
  
  constructor(
    @Inject(PRIVATE_NAVIGATION) nav: PrivateNavigationPaths,
    private defaultControllerServices: DefaultComponentServices,
    protected systemTeamRepositoryService: ServiceDeliveryTeamMemberRepositoryService,
    private resourceUrlService: ResourceUrlService
  ) {
    // Store injected resources
    this.nav = nav;

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    /**
     * fetches data
     */
    this._fetchData();
  }

  /**
   * Get team member photo URL
   * 
   * ✅ NEW: Uses ResourceUrlService
   * 
   * Development mode: Returns theme asset path
   * Production mode: Returns signed URL (future)
   * 
   * Benefits:
   * - Centralized URL logic (one place to change)
   * - Environment-aware (dev vs prod)
   * - Ready for signed URLs when API available
   * - Employee cleanup via signature expiration (future)
   * 
   * @param imageName - Team member's image filename (e.g., "avatar-2.jpg")
   * @returns Observable<string> - Full URL to photo
   */
  getUserPhotoUrl(imageName: string): Observable<string> {
    return this.resourceUrlService.getTeamMemberPhotoUrl(imageName);
  }

  /**
 * User grid data fetches
 */
  private _fetchData() {
    this.systemTeamRepositoryService
      .getPage(1)
      .subscribe(x => this.team$ = of(x));
  }

}
