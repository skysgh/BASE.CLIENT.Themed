// Ag:
import { Component, OnInit, inject } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:

// Services:
import { ViewModel } from './vm';
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { OidcService } from '../../../../../../core.ag/auth/services/oidc.service';
import { NavigationService } from '../../../../../../core/services/navigation.service';

@Component({
    selector: 'app-base-core-errors-alt',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * 404 Alt Component
 * 
 * Alternative styled error page shown when a route is not found.
 * 
 * UX:
 * - Back button: Primary (success green for this theme), first position - always shown
 * - Home/Hub link: Secondary (outline), second position
 *   - Shows "Hub" for authenticated users (links to system/hub)
 *   - Shows "Home" for anonymous users (links to /)
 */
export class BaseErrors404AltComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration;
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration;

  // Services
  private oidcService = inject(OidcService);
  private navigationService = inject(NavigationService);

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  /** Whether user is authenticated (determines Home vs Hub label) */
  public isAuthenticated: boolean = false;

  /** The home/hub URL based on authentication state */
  public homeUrl: string = '/';

  constructor(private defaultControllerServices: DefaultComponentServices) {
  }

  ngOnInit(): void {
    // Check authentication state
    this.isAuthenticated = this.oidcService.isAuthenticated();

    // Set destination URL based on authentication state
    if (this.isAuthenticated) {
      this.homeUrl = this.navigationService.getUrl('system/hub');
    } else {
      this.homeUrl = '/';
    }
  }

  /**
   * Navigate back in browser history
   */
  goBack(): void {
    window.history.back();
  }
}
