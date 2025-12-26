//Rx:
//
// Ag:
import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
// Sites DI Tokens:
import { 
  DEPLOYED_RESOURCES,      // Static assets (logos)
  DeployedResourcePaths,
  PUBLIC_NAVIGATION,       // ✅ NEW: Public navigation (no auth required)
  PublicNavigationPaths 
} from '../../../../../../tokens';
// Configuration:
import { appsConfiguration } from '../../../../../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-core-pages-landing-index-header',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Header Component
 * 
 * ✅ FULLY MIGRATED - Security-Classified DI Pattern
 * 
 * Uses PUBLIC_NAVIGATION because:
 * - Shown on public pages (no auth required)
 * - Contains sign in/up links
 * - Marketing/landing page navigation
 * 
 * Token Usage:
 * - DEPLOYED_RESOURCES: Static logos (safe, CDN-friendly)
 * - PUBLIC_NAVIGATION: Unauthenticated routes (landing, auth, support)
 * 
 * Benefits:
 * ✅ No upward coupling (Sites no longer imports Apps.Main)
 * ✅ Security-conscious (public vs private routes)
 * ✅ Testable (mock tokens)
 * ✅ Type-safe (full intellisense)
 * 
 * See: _custom/documentation/patterns/navigation-public-private-split-summary.md
 */
export class BaseAppsPagesLandingIndexHeaderComponent implements OnInit {
  // ⚠️ PARTIAL: Still uses appsConfiguration for some config
  // TODO: Create APP_CONTEXT token for sponsor/developer info
  public appsConfiguration = appsConfiguration
  
  // ✅ Injected DEPLOYED resources (static, safe)
  public deployed!: DeployedResourcePaths;
  
  // ✅ Injected PUBLIC navigation (no auth required)
  public nav!: PublicNavigationPaths;
  
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  // Changing this (by the parent body div wrapper)
  // changes the style of the button.
  @Input()
  sectionId: string = this.sectionsInfo.intro.id;
  
  constructor(
    @Inject(DEPLOYED_RESOURCES) deployed: DeployedResourcePaths,
    @Inject(PUBLIC_NAVIGATION) nav: PublicNavigationPaths,
    private defaultControllerServices: DefaultComponentServices) {

    // Store injected resources and navigation
    this.deployed = deployed;
    this.nav = nav;
    
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
