// Rx:
import { Observable } from 'rxjs';
// Ag:
import { Component, OnInit, Inject } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Sites DI Tokens:
import { 
  PUBLIC_NAVIGATION,       // ✅ Public navigation (no auth required)
  PublicNavigationPaths 
} from '../../../../../../../tokens';
// Constants:
import { appsConfiguration } from '../../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../../configuration/implementation/sites.configuration';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
import { AccountService } from '../../../../../../../../core/services/account.service';
import { ViewModel } from './vm';
import { TranslationService } from '../../../../../../../../core/services/translation.service';


@Component({
    selector: 'app-base-common-components-footer-ooo',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})


/**
 * Footer Component
 * 
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding
 * 
 * Uses PUBLIC_NAVIGATION for:
 * - Public information links (About, Privacy, Support)
 * - No authentication required for footer links
 * 
 * Token Usage:
 * - PUBLIC_NAVIGATION: Public routes (information, support)
 * - AccountService: Reactive account-specific branding (logos, titles)
 * 
 * Benefits:
 * ✅ No upward coupling (Sites no longer imports Apps.Main)
 * ✅ Multi-account ready (logos change per account)
 * ✅ Testable (mock tokens and AccountService)
 * ✅ Type-safe (full intellisense)
 */
export class BaseAppsPagesLandingIndexFooterComponent implements OnInit {
  // ⚠️ PARTIAL: Still uses appsConfiguration for description/copyrights
  // TODO: Move to AccountService
  public appsConfiguration = appsConfiguration
  
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // ✅ Injected PUBLIC navigation (no auth required)
  public nav!: PublicNavigationPaths;

  // ✅ Account-aware branding (reactive)
  public logo$: Observable<string | undefined>;
  public appTitle$: Observable<string | undefined>;

  vm = new ViewModel(appsConfiguration);

  constructor(
    @Inject(PUBLIC_NAVIGATION) nav: PublicNavigationPaths,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translationService: TranslationService,
    private accountService: AccountService
  ) {
    // Store injected navigation
    this.nav = nav;

    // ✅ Get branding from account config (reactive)
    this.logo$ = this.accountService.getConfigValue('branding.logo');
    this.appTitle$ = this.accountService.getConfigValue('name');

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
  }
}
