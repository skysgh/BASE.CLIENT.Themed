//Rx:
import { Observable } from 'rxjs';
// Ag:
import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
// Sites DI Tokens:
import { 
  PUBLIC_NAVIGATION,       // ✅ Public navigation (no auth required)
  PublicNavigationPaths 
} from '../../../../../../tokens';
// Configuration:
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { AccountService } from '../../../../../../../core/services/account.service';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';


@Component({
    selector: 'app-base-core-pages-landing-index-header',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})


/**
 * Header Component
 * 
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding
 * 
 * Uses PUBLIC_NAVIGATION because:
 * - Shown on public pages (no auth required)
 * - Contains sign in/up links
 * - Marketing/landing page navigation
 * 
 * Token Usage:
 * - PUBLIC_NAVIGATION: Unauthenticated routes (landing, auth, support)
 * - AccountService: Reactive account-specific branding (logos, titles)
 * 
 * Benefits:
 * ✅ No upward coupling (Sites no longer imports Apps.Main)
 * ✅ Security-conscious (public vs private routes)
 * ✅ Multi-account ready (reactive logos per account)
 * ✅ Testable (mock tokens and AccountService)
 * ✅ Type-safe (full intellisense)
 */
export class BaseAppsPagesLandingIndexHeaderComponent implements OnInit {
  
  // ✅ Injected PUBLIC navigation (no auth required)
  public nav!: PublicNavigationPaths;
  
  // ✅ Account-aware logos (reactive)
  public logoDark$: Observable<string | undefined>;
  public logoLight$: Observable<string | undefined>;
  
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  sectionsInfo = importedSectionsInfo;

  // Changing this (by the parent body div wrapper)
  // changes the style of the button.
  @Input()
  sectionId: string = this.sectionsInfo.intro.id;
  
  constructor(
    @Inject(PUBLIC_NAVIGATION) nav: PublicNavigationPaths,
    private defaultControllerServices: DefaultComponentServices,
    private accountService: AccountService
  ) {
    // Store injected navigation
    this.nav = nav;
    
    // ✅ Get logos from account config (reactive)
    this.logoDark$ = this.accountService.getConfigValue('branding.logo');
    this.logoLight$ = this.accountService.getConfigValue('branding.logoDark');
    
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    // Nothing?
  }

  //Button Event Handler:
  public onToggleMenu() {
    document.getElementById('navbarSupportedContent')?.classList.toggle('show');
  }

  // Event handler for window event:
  // tslint:disable-next-line: typedef
  onWindowScroll() {
    const navbar = document.getElementById('navbar');
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
      navbar?.classList.add('is-sticky');
    }
    else {
      navbar?.classList.remove('is-sticky');
    }
  }
}
