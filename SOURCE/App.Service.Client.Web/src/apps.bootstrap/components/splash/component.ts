import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppReadinessService } from '../../../core/services/app-readiness.service';
import { AccountService } from '../../../core/services/account.service';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  
  public isReady = false;
  private subscription?: Subscription;
  
  // ✅ Account-aware logo (Observable that filters out undefined)
  public logoUrl$: Observable<string>;
  public accountName$: Observable<string>;
  
  constructor(
    private appReadiness: AppReadinessService,
    private accountService: AccountService
  ) {
    // ✅ Get logo and name from account config, with fallback defaults
    this.logoUrl$ = this.accountService.getConfigValue('branding.logoDark').pipe(
      map(url => url || '/assets/core/media/open/accounts/default/logo-dark.svg')
    );
    this.accountName$ = this.accountService.getConfigValue('name').pipe(
      map(name => name || 'BASE')
    );
  }
  
  ngOnInit(): void {
    // Listen for app readiness
    this.subscription = this.appReadiness.isReady$.subscribe(ready => {
      if (ready) {
        // Add small delay to prevent jarring transition
        setTimeout(() => {
          this.isReady = true;
        }, 300);
      }
    });
  }
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
