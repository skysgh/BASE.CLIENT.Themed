// Rx:
import { Observable } from 'rxjs';
// Ag:
import { Component, OnInit, Inject } from '@angular/core';
// Sites DI Tokens:
import { 
  PUBLIC_NAVIGATION,       // ✅ Public navigation (no auth required)
  PublicNavigationPaths 
} from '../../../../../../tokens';
// Constants:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../../core/services/system.diagnostics-trace.service';
import { AccountService } from '../../../../../../../core/services/account.service';
import { TranslationService } from '../../../../../../../core/services/translation.service';


@Component({
    selector: 'app-base-common-components-footer-ooo',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})


/**
 * Footer Component
 * 
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding and content
 * 
 * Uses PUBLIC_NAVIGATION for:
 * - Public information links (About, Privacy, Support)
 * - No authentication required for footer links
 * 
 * Token Usage:
 * - PUBLIC_NAVIGATION: Public routes (information, support)
 * - AccountService: Reactive account-specific branding (logos, titles, descriptions)
 * 
 * Benefits:
 * ✅ No upward coupling (Sites no longer imports Apps.Main)
 * ✅ Multi-account ready (content changes per account)
 * ✅ Testable (mock tokens and AccountService)
 * ✅ Type-safe (full intellisense)
 */
export class BaseAppsPagesLandingIndexFooterComponent implements OnInit {
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // ✅ Injected PUBLIC navigation (no auth required)
  public nav!: PublicNavigationPaths;

  // ✅ Fallback values
  public currentYear = new Date().getFullYear();

  // ✅ Account-aware branding (reactive)
  public logo$: Observable<string | undefined>;
  public appTitle$: Observable<string | undefined>;

  // ✅ Account-aware description and copyrights (reactive)
  public description$: Observable<string | undefined>;
  public purpose$: Observable<string | undefined>;
  public copyrightYear$: Observable<string | undefined>;
  public developerTitle$: Observable<string | undefined>;
  public serviceTitle$: Observable<string | undefined>;

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

    // ✅ Get description/copyrights from account config (reactive)
    this.description$ = this.accountService.getConfigValue('description.description');
    this.purpose$ = this.accountService.getConfigValue('description.purpose');
    this.serviceTitle$ = this.accountService.getConfigValue('description.title');
    this.copyrightYear$ = this.accountService.getConfigValue('copyrights.year');
    this.developerTitle$ = this.accountService.getConfigValue('context.developer.title');

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
  }
}
