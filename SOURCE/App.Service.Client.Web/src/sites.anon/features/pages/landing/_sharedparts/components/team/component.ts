// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit, Inject } from '@angular/core';
// Sites DI Tokens:
import { 
  UPLOADED_RESOURCES,      // User-generated content (profile photos)
  UploadedResourcePaths,
  PRIVATE_NAVIGATION,      // ✅ UPDATED: Private navigation (includes public)
  PrivateNavigationPaths 
} from '../../../../../../tokens';
// Configuration:
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
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
 * 
 * ✅ FULLY MIGRATED - Security-Classified DI Pattern
 * 
 * Uses PRIVATE_NAVIGATION because:
 * - May show authenticated user context
 * - PRIVATE_NAVIGATION includes public routes via .public property
 * - Ready for role-based team features (future)
 * 
 * Token Usage:
 * - UPLOADED_RESOURCES: User profile photos (HIGH RISK - user-generated)
 * - PRIVATE_NAVIGATION: Full navigation tree (private + public)
 * 
 * Security Classification:
 * - Profile photos are USER-UPLOADED (untrusted, needs auth)
 * - Future enhancement: Will use signed URLs with expiration
 * 
 * Benefits:
 * ✅ Security-conscious architecture (uploaded content explicitly marked)
 * ✅ Ready for signed URL migration (future enhancement)
 * ✅ Testable (mock the injection tokens)
 * ✅ Flexible (swap implementations per environment)
 * ✅ Full navigation tree available (private + public)
 * 
 * See: _custom/documentation/patterns/navigation-public-private-split-summary.md
 */
export class BaseAppsPagesLandingIndexTeamComponent implements OnInit {
  // ⚠️ PARTIAL: Still uses appsConfiguration for some settings
  // TODO: Create APP_CONTEXT token for sponsor/developer info
  public appsConfiguration = appsConfiguration
  
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // ✅ Injected UPLOADED resource paths (HIGH RISK - user-generated)
  public uploaded!: UploadedResourcePaths;
  
  // ✅ Injected PRIVATE navigation (includes public via .public)
  public nav!: PrivateNavigationPaths;

  team$: Observable<ServiceDeliveryTeamMemberVTO[]> = of([]);

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;
  
  constructor(
    @Inject(UPLOADED_RESOURCES) uploaded: UploadedResourcePaths,
    @Inject(PRIVATE_NAVIGATION) nav: PrivateNavigationPaths,
    private defaultControllerServices: DefaultComponentServices,
    protected systemTeamRepositoryService :ServiceDeliveryTeamMemberRepositoryService  ) {

    // Store injected resources
    this.uploaded = uploaded;
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
   * Get user profile photo URL
   * 
   * Current implementation: Basic path concatenation
   * Future enhancement: Will use ResourceUrlService for signed URLs
   * 
   * @param imageName - User's image filename (e.g., "user123.jpg")
   * @returns Full URL to user's profile photo
   */
  getUserPhotoUrl(imageName: string): string {
    // ✅ Uses uploaded resources (user-generated content)
    // TODO: Migrate to signed URLs: return this.resourceUrlService.getSignedUrl(path, 60);
    const fullPath = this.uploaded.users.profiles + imageName;
    
    // Temporary debug logging
    console.log('Team Component - getUserPhotoUrl:', {
      imageName,
      profilesPath: this.uploaded.users.profiles,
      fullPath
    });
    
    return fullPath;
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
