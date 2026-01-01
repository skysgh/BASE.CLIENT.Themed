/**
 * Coming Soon View Component
 * 
 * Displays a "coming soon" page for features not yet available.
 * Includes countdown timer and email notification signup.
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-page-wrapper pt-5">
      <!-- Background -->
      <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
        <div class="bg-overlay"></div>
        <div class="shape">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1440 120">
            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="auth-page-content">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center mt-sm-5 pt-4 mb-4">
                
                <!-- Icon animation -->
                <div class="mb-sm-5 pb-sm-4 pb-5">
                  <div class="avatar-xl mx-auto">
                    <div class="avatar-title bg-primary-subtle rounded-circle">
                      <i class="ri-rocket-2-line display-4 text-primary"></i>
                    </div>
                  </div>
                </div>
                
                <!-- Title -->
                <div class="mb-5">
                  <h1 class="display-2 coming-soon-text">{{ title }}</h1>
                  <p class="text-white-50 fs-16 mt-3">{{ message }}</p>
                </div>
                
                <!-- Countdown -->
                @if (targetDate) {
                  <div class="row justify-content-center mt-5">
                    <div class="col-lg-8">
                      <div class="countdownlist d-flex justify-content-center gap-3 flex-wrap">
                        <div class="countdownlist-item text-center">
                          <div class="count-num text-white display-5">{{ days }}</div>
                          <div class="count-title text-white-50">Days</div>
                        </div>
                        <div class="countdownlist-item text-center">
                          <div class="count-num text-white display-5">{{ hours }}</div>
                          <div class="count-title text-white-50">Hours</div>
                        </div>
                        <div class="countdownlist-item text-center">
                          <div class="count-num text-white display-5">{{ minutes }}</div>
                          <div class="count-title text-white-50">Minutes</div>
                        </div>
                        <div class="countdownlist-item text-center">
                          <div class="count-num text-white display-5">{{ seconds }}</div>
                          <div class="count-title text-white-50">Seconds</div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                
                <!-- Email signup -->
                <div class="mt-5">
                  <h4 class="text-white">Get notified when we launch</h4>
                  <p class="text-white-50">We'll send you an email when this feature is ready.</p>
                  
                  <div class="input-group mx-auto my-4" style="max-width: 400px;">
                    <input 
                      type="email" 
                      class="form-control border-light shadow"
                      [(ngModel)]="email"
                      placeholder="Enter your email address">
                    <button 
                      class="btn btn-success" 
                      type="button"
                      [disabled]="!email || submitted"
                      (click)="submitEmail()">
                      @if (submitted) {
                        <i class="ri-check-line me-1"></i> Subscribed!
                      } @else {
                        Send <i class="ri-send-plane-2-fill ms-1"></i>
                      }
                    </button>
                  </div>
                </div>
                
                <!-- Back button -->
                <div class="mt-4">
                  <a routerLink="/" class="btn btn-outline-light">
                    <i class="ri-arrow-left-line me-1"></i> Back to Home
                  </a>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="text-center">
                <p class="mb-0 text-muted">
                  &copy; {{ year }} {{ companyName }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .auth-page-wrapper {
      min-height: 100vh;
    }
    
    .countdownlist-item {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      padding: 1rem 1.5rem;
      min-width: 100px;
    }
    
    .count-num {
      font-weight: 600;
    }
    
    .count-title {
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  // Configuration
  title = 'Coming Soon';
  message = 'We\'re working hard on this feature. Stay tuned!';
  companyName = 'Your Company';
  year = new Date().getFullYear();
  
  // Target launch date (set to 30 days from now for demo)
  targetDate: Date | null = null;
  
  // Countdown values
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  
  // Email signup
  email = '';
  submitted = false;
  
  private intervalId: any;
  
  ngOnInit(): void {
    // Set target date to 30 days from now
    this.targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // Start countdown
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }
  
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  private updateCountdown(): void {
    if (!this.targetDate) return;
    
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;
    
    if (distance < 0) {
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      return;
    }
    
    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }
  
  submitEmail(): void {
    if (!this.email) return;
    
    // TODO: Submit to API
    console.log('[ComingSoon] Email submitted:', this.email);
    this.submitted = true;
  }
}
