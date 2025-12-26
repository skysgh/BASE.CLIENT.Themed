// Ag:
import { Component, OnInit, Inject } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Sites DI Tokens:
import { 
  DEPLOYED_RESOURCES,      // Static assets (logos)
  DeployedResourcePaths,
  PUBLIC_NAVIGATION,       // ✅ NEW: Public navigation (no auth required)
  PublicNavigationPaths 
} from '../../../../../../../tokens';
// Constants:
import { appsConfiguration } from '../../../../../../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../../configuration/implementation/sites.configuration';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
import { ViewModel } from './vm';
import { TranslationService } from '../../../../../../../../core/services/translation.service';


@Component({
  selector: 'app-base-common-components-footer-ooo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 * 
 * ✅ FULLY MIGRATED - Security-Classified DI Pattern
 * 
 * Uses PUBLIC_NAVIGATION because:
 * - Shown on all pages (public and private)
 * - Contains public information links (About, Privacy, Support)
 * - No authentication required for footer links
 * 
 * Token Usage:
 * - DEPLOYED_RESOURCES: Static logos (safe, CDN-friendly)
 * - PUBLIC_NAVIGATION: Public routes (information, support)
 * 
 * Note: Footer could also use PRIVATE_NAVIGATION.public.* when authenticated,
 * but using PUBLIC_NAVIGATION keeps it simple since footer is primarily public info.
 * 
 * Benefits:
 * ✅ No upward coupling (Sites no longer imports Apps.Main)
 * ✅ Security-conscious (public routes only)
 * ✅ Testable (mock tokens)
 * ✅ Type-safe (full intellisense)
 * 
 * See: _custom/documentation/patterns/navigation-public-private-split-summary.md
 */
export class BaseAppsPagesLandingIndexFooterComponent implements OnInit {
  // ⚠️ PARTIAL: Still uses appsConfiguration for description/copyrights
  // TODO: Create APP_CONTEXT token for sponsor/developer info
  public appsConfiguration = appsConfiguration
  
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // ✅ Injected DEPLOYED resources (static, safe)
  public deployed!: DeployedResourcePaths;
  
  // ✅ Injected PUBLIC navigation (no auth required)
  public nav!: PublicNavigationPaths;

  vm = new ViewModel(appsConfiguration);

  constructor(
    @Inject(DEPLOYED_RESOURCES) deployed: DeployedResourcePaths,
    @Inject(PUBLIC_NAVIGATION) nav: PublicNavigationPaths,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translationService: TranslationService) {

    // Store injected resources and navigation
    this.deployed = deployed;
    this.nav = nav;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
  }

}
