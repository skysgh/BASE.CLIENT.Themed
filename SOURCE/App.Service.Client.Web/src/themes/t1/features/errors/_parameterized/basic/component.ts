/**
 * Parameterized Error Component - Basic Layout
 * 
 * A single reusable error page component that handles all error codes.
 * Receives error code from route parameter and looks up configuration.
 * 
 * Route: /errors/basic/:code (e.g., /errors/basic/404, /errors/basic/500)
 * 
 * Architecture:
 * - Reads error code from route params
 * - Looks up config in ERROR_DATA
 * - Falls back to '000' (unknown) if code not found
 * - Uses i18n translation keys for all text
 * 
 * Benefits:
 * - DRY: Single component for all error pages
 * - Maintainable: Add new codes by updating error-data.ts only
 * - Consistent: Same layout, different content
 * - i18n: All text is translatable
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Error data:
import { ErrorPageConfig, getErrorConfig } from '../../error-data';

@Component({
  selector: 'app-error-page-basic',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class ErrorPageBasicComponent implements OnInit {
  // Configuration access
  public appsConfiguration = appsConfiguration;
  public groupConfiguration = themesT1Configuration;

  // Error configuration (loaded from route param)
  public errorConfig!: ErrorPageConfig;

  // Computed properties for template
  public errorCode = '000';
  public errorImage = '';

  constructor(
    private route: ActivatedRoute,
    private defaultComponentServices: DefaultComponentServices
  ) {}

  ngOnInit(): void {
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
