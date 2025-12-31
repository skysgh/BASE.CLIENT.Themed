/**
 * Parameterized Error Component - Alt Layout
 * 
 * Alternative layout with card-based design and Lord Icon animation.
 * 
 * Route: /errors/alt/:code
 */
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Error data:
import { ErrorPageConfig, getErrorConfig } from '../../error-data';

@Component({
    selector: 'app-error-page-alt',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class ErrorPageAltComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public groupConfiguration = themesT1Configuration;

  public errorConfig!: ErrorPageConfig;
  public errorCode = '000';

  constructor(
    private route: ActivatedRoute,
    private defaultComponentServices: DefaultComponentServices
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const code = params['code'] || '000';
      this.errorCode = code;
      this.errorConfig = getErrorConfig(code);
    });
  }

  goBack(): void {
    window.history.back();
  }
}
