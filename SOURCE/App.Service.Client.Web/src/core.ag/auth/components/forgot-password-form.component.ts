/**
 * Forgot Password Form Component
 * 
 * Request password reset via email.
 * In demo mode, shows the reset token directly.
 * 
 * LOCATION: core.ag (Angular-specific component)
 */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * Password reset request
 */
export interface ForgotPasswordRequest {
  email: string;
}

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="forgot-password-form">
      
      <!-- Success State -->
      @if (emailSent) {
        <div class="text-center">
          <div class="avatar-lg mx-auto mb-4">
            <div class="avatar-title bg-success-subtle rounded-circle">
              <i class="ri-mail-send-line fs-36 text-success"></i>
            </div>
          </div>
          <h4 class="mb-2">Check Your Email</h4>
          <p class="text-muted mb-4">
            We've sent a password reset link to <strong>{{ submittedEmail }}</strong>
          </p>
          
          <!-- Demo mode: show token -->
          @if (demoToken) {
            <div class="alert alert-info text-start">
              <strong>Demo Mode:</strong> Reset token for testing:<br>
              <code class="user-select-all">{{ demoToken }}</code>
            </div>
          }

          <div class="mt-4">
            <button 
              type="button" 
              class="btn btn-primary"
              (click)="onBackToLogin()">
              <i class="ri-arrow-left-line me-1"></i>
              Back to Sign In
            </button>
          </div>
          
          <div class="mt-3">
            <button 
              type="button" 
              class="btn btn-link text-muted"
              (click)="resetForm()">
              Didn't receive? Try again
            </button>
          </div>
        </div>
      } @else {
        <!-- Request Form -->
        <div class="text-center mb-4">
          <div class="avatar-lg mx-auto mb-4">
            <div class="avatar-title bg-primary-subtle rounded-circle">
              <i class="ri-lock-password-line fs-36 text-primary"></i>
            </div>
          </div>
          <h4 class="mb-2">{{ title }}</h4>
          <p class="text-muted">{{ subtitle }}</p>
        </div>

        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
          
          <!-- Email -->
          <div class="mb-4">
            <label class="form-label" for="email">{{ emailLabel }}</label>
            <input 
              type="email"
              class="form-control"
              id="email"
              formControlName="email"
              [ngClass]="{ 'is-invalid': submitted && f['email'].errors }"
              [placeholder]="emailPlaceholder">
            @if (submitted && f['email'].errors) {
              <div class="invalid-feedback">
                @if (f['email'].errors['required']) {
                  <span>Email is required</span>
                }
                @if (f['email'].errors['email']) {
                  <span>Please enter a valid email</span>
                }
              </div>
            }
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

        <!-- Back to sign in -->
        <div class="mt-4 text-center">
          <p class="mb-0 text-muted">
            Remember your password? 
            <a [routerLink]="signInRoute" class="fw-semibold text-primary">Sign In</a>
          </p>
        </div>
      }
    </div>
  `,
  styles: [`
    .forgot-password-form {
      width: 100%;
    }
  `]
})
export class ForgotPasswordFormComponent implements OnInit {
  
  // Labels
  @Input() title = 'Forgot Password?';
  @Input() subtitle = 'Enter your email and we\'ll send you a link to reset your password.';
  @Input() emailLabel = 'Email';
  @Input() emailPlaceholder = 'Enter your email address';
  @Input() submitText = 'Send Reset Link';
  @Input() signInRoute = '/auth/signin';

  // State
  @Input() loading = false;
  @Input() errorMessage: string | null = null;
  @Input() demoToken: string | null = null;

  // Events
  @Output() resetSubmit = new EventEmitter<ForgotPasswordRequest>();
  @Output() backToLogin = new EventEmitter<void>();

  // Form
  forgotForm!: FormGroup;
  submitted = false;
  emailSent = false;
  submittedEmail = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.forgotForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.forgotForm.invalid) {
      return;
    }

    this.submittedEmail = this.f['email'].value;
    this.resetSubmit.emit({
      email: this.f['email'].value
    });
  }

  /**
   * Called by parent when email is successfully sent
   */
  showSuccess(token?: string): void {
    this.emailSent = true;
    this.demoToken = token || null;
  }

  resetForm(): void {
    this.emailSent = false;
    this.submitted = false;
    this.demoToken = null;
    this.forgotForm.reset();
  }

  onBackToLogin(): void {
    this.backToLogin.emit();
  }
}
