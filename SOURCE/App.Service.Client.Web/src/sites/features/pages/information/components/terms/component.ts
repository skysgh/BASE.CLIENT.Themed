// Ag:
import { Component, Input, OnInit } from '@angular/core';
// Configuration:
import { sitesConfiguration } from '../../../../../configuration/implementation/sites.configuration';
// ✅ NEW: Use ConfigRegistry instead of direct import
import { ConfigRegistryService } from '../../../../../../core/services/config-registry.service';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-information-terms',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
/**
 * Terms & Conditions Component
 *
 * ✅ MIGRATED: No longer imports appsConfiguration directly
 *
 * Uses ConfigRegistryService to get Apps config.
 * This breaks circular dependency (Sites → Apps → Sites).
 *
 * Benefits:
 * ✅ No circular dependency
 * ✅ Proper tier architecture
 * ✅ Easy to test (mock registry)
 * ✅ Loose coupling
 */
export class BaseCorePagesInformationTermsComponent implements OnInit {
  // ✅ Get apps config from registry (not direct import)
  private appsConfig: any;

  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel!: ViewModel;

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  @Input()
  public replacements :{ [key: string]: string }|undefined;

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private configRegistry: ConfigRegistryService  // ✅ NEW: Inject registry
  ) {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    // ✅ Get config from registry instead of direct import
    this.appsConfig = this.configRegistry.get('apps');

    // ✅ Create ViewModel with config from registry
    this.viewModel = new ViewModel(this.appsConfig);

    // Note that tokens are not wrapped in the {{...}}
    // that must be on to find them:
    // Does not work yet:
    //this.replacements=
    //{
    //  'system.title': this.system.title,
    //  'system.description': this.system.description,
    //  'appsConfiguration.context.sponsor.title': this.appsConfig.context.sponsor.title,
    //  'system.dynamic.developer.title': this.system.dynamic.developer.title,
    //}
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

    // Configure breadcrumbs:
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Information' },
      { label: 'Term & Conditions', active: true }
    ];
  }

  // ✅ NEW: Expose appsConfiguration for template compatibility
  // (Templates may reference this.appsConfiguration)
  public get appsConfiguration() {
    return this.appsConfig;
  }
}
