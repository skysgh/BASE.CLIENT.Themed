/**
 * Parameterized Error Component - Cover Layout
 * 
 * Cover layout version of the parameterized error page.
 * Uses error image as cover background with card overlay.
 * 
 * Route: /errors/cover/:code
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
    selector: 'app-error-page-cover',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class ErrorPageCoverComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public groupConfiguration = themesT1Configuration;

  public errorConfig!: ErrorPageConfig;
  public errorCode = '000';
  public errorImage = '';

  constructor(
    private route: ActivatedRoute,
    private defaultComponentServices: DefaultComponentServices
  ) {}

  ngOnInit(): void {
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
