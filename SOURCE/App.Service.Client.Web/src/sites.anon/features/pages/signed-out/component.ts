// Rx:
import { Observable } from 'rxjs';
// Ag:
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
// Configuration:
import { sitesConfiguration } from '../../../configuration/implementation/sites.configuration';
// Services:
import { DefaultComponentServices } from '../../../../core/services/default-controller-services';
import { AppStatsService, AppStats } from './services/app-stats.service';

/**
 * Signed-Out Landing Page
 * 
 * Shown after user signs out. Displays:
 * - Thank you message
 * - App statistics/value proposition
 * - Navigation options (sign in again, or visit brochure site)
 * 
 * Purpose: Instead of immediately dumping user at login page,
 * use the opportunity to showcase app value and provide choices.
 */
@Component({
  selector: 'app-signed-out-landing',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // For lord-icon web component
})
export class SignedOutLandingComponent implements OnInit {
  public sitesConfiguration = sitesConfiguration;
  
  // App statistics
  public stats$: Observable<AppStats>;
  
  // Navigation paths
  public signInPath = '/auth/signin';
  public homePath = '/';
  public pricingPath = '/pages/pricing';
  public aboutPath = '/pages/information/about';
  
  // For template
  public currentYear = new Date().getFullYear();
  
  constructor(
    private router: Router,
    private defaultServices: DefaultComponentServices,
    private appStatsService: AppStatsService
  ) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
    this.stats$ = this.appStatsService.getStats();
  }
  
  ngOnInit(): void {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
  }
  
  /**
   * Navigate to sign in page
   */
  goToSignIn(): void {
    this.router.navigate([this.signInPath]);
  }
  
  /**
   * Navigate to brochure/home page
   */
  goToHome(): void {
    this.router.navigate([this.homePath]);
  }
  
  /**
   * Navigate to pricing page
   */
  goToPricing(): void {
    this.router.navigate([this.pricingPath]);
  }
}
