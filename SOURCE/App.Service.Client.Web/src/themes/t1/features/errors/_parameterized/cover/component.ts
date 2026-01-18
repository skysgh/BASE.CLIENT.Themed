/**
 * Parameterized Error Component - Cover Layout
 * 
 * Cover layout version of the parameterized error page.
 * Uses error image as cover background with card overlay.
 * 
 * Route: /errors/cover/:code
 * 
 * UX:
 * - Back button: Primary (blue), first position - always shown
 * - Home/Hub link: Secondary (outline), second position
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
    selector: 'app-error-page-cover',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class ErrorPageCoverComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public groupConfiguration = themesT1Configuration;

  // Services
  private oidcService = inject(OidcService);
  private navigationService = inject(NavigationService);

  public errorConfig!: ErrorPageConfig;
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

    this.route.params.subscribe(params => {
      const code = params['code'] || '000';
      this.errorCode = code;
      this.errorConfig = getErrorConfig(code);
      
      // Use cover-specific image if available
      const coverImage = code === '404' ? 'error400-cover.png' : this.errorConfig.image;
      this.errorImage = `${this.appsConfiguration.others.themes.current.constants.assets.images.pages.errors}${coverImage}`;
    });
  }

  goBack(): void {
    window.history.back();
  }
}
