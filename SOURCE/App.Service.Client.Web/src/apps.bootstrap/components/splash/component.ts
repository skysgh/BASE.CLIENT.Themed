import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppReadinessService } from '../../../core/services/app-readiness.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  
  public isReady = false;
  private subscription?: Subscription;
  
  constructor(private appReadiness: AppReadinessService) {}
  
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
