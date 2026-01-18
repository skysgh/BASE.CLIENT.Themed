/**
 * Parameterized Error Component - Basic Layout
 * 
 * A single reusable error page component that handles all error codes.
 * Receives error code from route parameter and looks up configuration.
 * 
 * Route: /errors/basic/:code (e.g., /errors/basic/404, /errors/basic/500)
 * 
 * UX:
 * - Back button: Primary (blue), first position - always shown
 * - Home/Hub link: Secondary (outline), second position
 *   - Shows "Hub" for authenticated users
 *   - Shows "Home" for anonymous users
 */
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { OidcService } from '../../../../../../core.ag/auth/services/oidc.service';
import { NavigationService } from '../../../../../../core/services/navigation.service';
// Error data:
import { ErrorPageConfig, getErrorConfig } from '../../error-data';

@Component({
    selector: 'app-error-page-basic',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class ErrorPageBasicComponent implements OnInit {
  // Configuration access
  public appsConfiguration = appsConfiguration;
  public groupConfiguration = themesT1Configuration;

  // Services
  private oidcService = inject(OidcService);
  private navigationService = inject(NavigationService);

  // Error configuration (loaded from route param)
  public errorConfig!: ErrorPageConfig;

  // Computed properties for template
  public errorCode = '000';
  public errorImage = '';

  /** Whether user is authenticated (determines Home vs Hub label) */
  public isAuthenticated: boolean = false;

  /** The home/hub URL based on authentication state */
  public homeUrl: string = '/';

  constructor(
    private route: ActivatedRoute,
    private defaultComponentServices: DefaultComponentServices
  ) {}

  ngOnInit(): void {
    // Check authentication state
    this.isAuthenticated = this.oidcService.isAuthenticated();

    // Set destination URL based on authentication state
    if (this.isAuthenticated) {
      this.homeUrl = this.navigationService.getUrl('system/hub');
    } else {
      this.homeUrl = '/';
    }

    // Get error code from route parameter
    this.route.params.subscribe(params => {
      const code = params['code'] || '000';
      this.errorCode = code;
      this.errorConfig = getErrorConfig(code);
      
      // Build image URL
      this.errorImage = `${this.appsConfiguration.others.themes.current.constants.assets.images.pages.errors}${this.errorConfig.image}`;
      
      this.defaultComponentServices.diagnosticsTraceService.info(
        `Error page loaded: ${code} - ${this.errorConfig.titleKey}`
      );
    });
  }

  /**
   * Navigate back in history
   */
  goBack(): void {
    window.history.back();
  }
}
