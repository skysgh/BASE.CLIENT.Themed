/**
 * Reset Password Form Component
 * 
 * Enter new password after clicking reset link.
 * Validates token and sets new password.
 * 
 * LOCATION: core.ag (Angular-specific component)
 */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="reset-password-form">
      
      <!-- Success State -->
      @if (resetSuccess) {
        <div class="text-center">
          <div class="avatar-lg mx-auto mb-4">
            <div class="avatar-title bg-success-subtle rounded-circle">
              <i class="ri-check-line fs-36 text-success"></i>
            </div>
          </div>
          <h4 class="mb-2">Password Reset!</h4>
          <p class="text-muted mb-4">
            Your password has been successfully changed. You can now sign in with your new password.
          </p>

          <div class="mt-4">
            <button 
              type="button" 
              class="btn btn-success w-100"
              (click)="onBackToLogin()">
              <i class="ri-login-box-line me-1"></i>
              Sign In Now
            </button>
          </div>
        </div>
      } @else if (invalidToken) {
        <!-- Invalid Token State -->
        <div class="text-center">
          <div class="avatar-lg mx-auto mb-4">
            <div class="avatar-title bg-danger-subtle rounded-circle">
              <i class="ri-error-warning-line fs-36 text-danger"></i>
            </div>
          </div>
          <h4 class="text-danger mb-2">Invalid or Expired Link</h4>
          <p class="text-muted mb-4">
            This password reset link is no longer valid. Please request a new one.
          </p>

          <div class="mt-4">
            <a [routerLink]="forgotPasswordRoute" class="btn btn-primary w-100">
              <i class="ri-mail-send-line me-1"></i>
              Request New Link
            </a>
          </div>
        </div>
      } @else {
        <!-- Reset Form -->
        <div class="text-center mb-4">
          <div class="avatar-lg mx-auto mb-4">
            <div class="avatar-title bg-primary-subtle rounded-circle">
              <i class="ri-lock-password-line fs-36 text-primary"></i>
            </div>
          </div>
          <h4 class="mb-2">{{ title }}</h4>
          <p class="text-muted">{{ subtitle }}</p>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
          
          <!-- Token (hidden or visible in demo) -->
          @if (showTokenInput) {
            <div class="mb-3">
              <label class="form-label" for="token">Reset Token</label>
              <input 
                type="text"
                class="form-control"
                id="token"
                formControlName="token"
                [ngClass]="{ 'is-invalid': submitted && f['token'].errors }"
                placeholder="Enter reset token">
              @if (submitted && f['token'].errors) {
                <div class="invalid-feedback">
                  <span>Token is required</span>
                </div>
              }
            </div>
          }

          <!-- New Password -->
          <div class="mb-3">
            <label class="form-label" for="newPassword">{{ passwordLabel }}</label>
            <div class="position-relative auth-pass-inputgroup">
              <input 
                [type]="showPassword ? 'text' : 'password'"
                class="form-control pe-5"
                id="newPassword"
                formControlName="newPassword"
                [ngClass]="{ 'is-invalid': submitted && f['newPassword'].errors }"
                [placeholder]="passwordPlaceholder">
              <button 
                type="button"
                class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                (click)="togglePassword()">
                <i class="mdi align-middle" 
                   [ngClass]="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></i>
              </button>
              @if (submitted && f['newPassword'].errors) {
                <div class="invalid-feedback">
                  @if (f['newPassword'].errors['required']) {
                    <span>Password is required</span>
                  }
                  @if (f['newPassword'].errors['minlength']) {
                    <span>Password must be at least 8 characters</span>
                  }
                </div>
              }
            </div>
            <!-- Password strength indicator -->
            <div class="mt-2">
              <div class="progress" style="height: 5px;">
                <div class="progress-bar" 
                     role="progressbar" 
                     [style.width.%]="passwordStrength"
                     [ngClass]="passwordStrengthClass"></div>
              </div>
              <small class="text-muted">{{ passwordStrengthText }}</small>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-4">
            <label class="form-label" for="confirmPassword">{{ confirmPasswordLabel }}</label>
            <div class="position-relative auth-pass-inputgroup">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'"
                class="form-control pe-5"
                id="confirmPassword"
                formControlName="confirmPassword"
                [ngClass]="{ 'is-invalid': submitted && f['confirmPassword'].errors }"
                [placeholder]="confirmPasswordPlaceholder">
              <button 
                type="button"
                class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                (click)="toggleConfirmPassword()">
                <i class="mdi align-middle" 
                   [ngClass]="showConfirmPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></i>
              </button>
              @if (submitted && f['confirmPassword'].errors) {
                <div class="invalid-feedback">
                  @if (f['confirmPassword'].errors['required']) {
                    <span>Please confirm your password</span>
                  }
                  @if (f['confirmPassword'].errors['passwordMismatch']) {
                    <span>Passwords do not match</span>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Error message -->
          @if (errorMessage) {
            <div class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>
          }

          <!-- Submit -->
          <div class="mt-4">
            <button 
              type="submit" 
              class="btn btn-success w-100"
              [disabled]="loading">
              @if (loading) {
                <span class="spinner-border spinner-border-sm me-1"></span>
              }
              {{ submitText }}
            </button>
          </div>

        </form>
      }
    </div>
  `,
  styles: [`
    .reset-password-form {
      width: 100%;
    }

    .auth-pass-inputgroup input {
      padding-right: 2.5rem;
    }
  `]
})
export class ResetPasswordFormComponent implements OnInit {
  
  // Labels
  @Input() title = 'Create New Password';
  @Input() subtitle = 'Your new password must be different from previous passwords.';
  @Input() passwordLabel = 'New Password';
  @Input() passwordPlaceholder = 'Enter new password';
  @Input() confirmPasswordLabel = 'Confirm New Password';
  @Input() confirmPasswordPlaceholder = 'Confirm new password';
  @Input() submitText = 'Reset Password';

  // Configuration
  @Input() token: string | null = null;
  @Input() showTokenInput = false; // For demo mode
  @Input() loading = false;
  @Input() errorMessage: string | null = null;
  @Input() forgotPasswordRoute = '/auth/forgot-password';

  // Events
  @Output() resetSubmit = new EventEmitter<ResetPasswordRequest>();
  @Output() backToLogin = new EventEmitter<void>();

  // State
  resetForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  resetSuccess = false;
  invalidToken = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      token: [this.token || '', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Custom validator for password match
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  get f() {
    return this.resetForm.controls;
  }

  /**
   * Password strength calculation
   */
  get passwordStrength(): number {
    const password = this.f['newPassword'].value || '';
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    
    return Math.min(100, strength);
  }

  get passwordStrengthClass(): string {
    const strength = this.passwordStrength;
    if (strength < 30) return 'bg-danger';
    if (strength < 60) return 'bg-warning';
    if (strength < 80) return 'bg-info';
    return 'bg-success';
  }

  get passwordStrengthText(): string {
    const strength = this.passwordStrength;
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    this.resetSubmit.emit({
      token: this.f['token'].value,
      newPassword: this.f['newPassword'].value
    });
  }

  /**
   * Called by parent when reset is successful
   */
  showSuccess(): void {
    this.resetSuccess = true;
  }

  /**
   * Called by parent when token is invalid
   */
  showInvalidToken(): void {
    this.invalidToken = true;
  }

  onBackToLogin(): void {
    this.backToLogin.emit();
  }
}
