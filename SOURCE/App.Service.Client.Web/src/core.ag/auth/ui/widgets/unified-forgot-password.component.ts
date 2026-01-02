/**
 * Unified Forgot Password Page Component
 * 
 * Handles the forgot password flow:
 * 1. User enters email
 * 2. System generates reset token (demo: shows it; prod: emails it)
 * 3. User enters new password with token
 * 
 * LOCATION: core.ag (Angular-specific component)
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

// Components
import { ForgotPasswordFormComponent, ForgotPasswordRequest } from './forgot-password-form.component';
import { ResetPasswordFormComponent, ResetPasswordRequest } from './reset-password-form.component';

// Services
import { FakeAuthRepository } from '../services/fake-auth-repository.service';
import { ToastService } from '../../../../core/services/toast.service';

type PasswordResetView = 'request' | 'reset';

@Component({
  selector: 'app-unified-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ForgotPasswordFormComponent,
    ResetPasswordFormComponent
  ],
  template: `
    <div class="unified-forgot-password">
      
      <!-- Request Reset View -->
      @if (currentView === 'request') {
        <app-forgot-password-form
          #forgotForm
          [loading]="loading"
          [errorMessage]="errorMessage"
          [signInRoute]="signInRoute"
          (resetSubmit)="onRequestReset($event)"
          (backToLogin)="navigateToLogin()">
        </app-forgot-password-form>
      }

      <!-- Reset Password View -->
      @if (currentView === 'reset') {
        <app-reset-password-form
          #resetForm
          [token]="resetToken"
          [showTokenInput]="showTokenInput"
          [loading]="loading"
          [errorMessage]="errorMessage"
          [forgotPasswordRoute]="forgotPasswordRoute"
          (resetSubmit)="onResetPassword($event)"
          (backToLogin)="navigateToLogin()">
        </app-reset-password-form>
      }

    </div>
  `,
  styles: [`
    .unified-forgot-password {
      width: 100%;
    }
  `]
})
export class UnifiedForgotPasswordComponent implements OnInit {
  
  @ViewChild('forgotForm') forgotFormComponent!: ForgotPasswordFormComponent;
  @ViewChild('resetForm') resetFormComponent!: ResetPasswordFormComponent;

  // Current view
  currentView: PasswordResetView = 'request';

  // Configuration
  signInRoute = '/auth/signin';
  forgotPasswordRoute = '/auth/forgot-password';
  showTokenInput = true; // In demo mode, user can enter token manually

  // State
  loading = false;
  errorMessage: string | null = null;
  resetToken: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fakeAuthRepo: FakeAuthRepository,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Check for token in URL (e.g., from email link)
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      this.resetToken = token;
      this.currentView = 'reset';
      this.showTokenInput = false; // Token came from URL, don't show input
    }
  }

  /**
   * Handle password reset request
   */
  async onRequestReset(request: ForgotPasswordRequest): Promise<void> {
    console.log('[ForgotPassword] Reset requested for:', request.email);
    
    this.loading = true;
    this.errorMessage = null;

    try {
      const result = this.fakeAuthRepo.requestPasswordReset(request.email);

      if (result.success) {
        // Show success in the form
        this.forgotFormComponent.showSuccess(result.token);
        
        // In demo mode, also show toast with token
        if (result.token) {
          this.toastService.show('Reset token generated (demo mode)', { 
            classname: 'bg-info text-white',
            delay: 10000
          });

          // Store token for demo convenience
          this.resetToken = result.token;
        }
      } else {
        this.errorMessage = result.error || 'Failed to send reset email. Please try again.';
      }
    } catch (error: any) {
      console.error('[ForgotPassword] Request error:', error);
      this.errorMessage = error.message || 'Failed to send reset email. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle password reset
   */
  async onResetPassword(request: ResetPasswordRequest): Promise<void> {
    console.log('[ForgotPassword] Resetting password with token');
    
    this.loading = true;
    this.errorMessage = null;

    try {
      const result = await this.fakeAuthRepo.resetPassword(request.token, request.newPassword);

      if (result.success) {
        // Show success in the form
        this.resetFormComponent.showSuccess();
        
        // Show success toast
        this.toastService.show('Password reset successfully!', { 
          classname: 'bg-success text-white' 
        });
      } else {
        if (result.error?.includes('expired') || result.error?.includes('invalid')) {
          this.resetFormComponent.showInvalidToken();
        } else {
          this.errorMessage = result.error || 'Failed to reset password. Please try again.';
        }
      }
    } catch (error: any) {
      console.error('[ForgotPassword] Reset error:', error);
      this.errorMessage = error.message || 'Failed to reset password. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Navigate to login page
   */
  navigateToLogin(): void {
    this.router.navigate([this.signInRoute]);
  }

  /**
   * Switch to reset view (for demo, after receiving token)
   */
  switchToResetView(): void {
    this.currentView = 'reset';
    this.errorMessage = null;
  }
}
