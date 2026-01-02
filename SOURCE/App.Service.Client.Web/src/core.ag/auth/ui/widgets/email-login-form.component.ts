/**
 * Email Login Form Component
 * 
 * Traditional email/password login form.
 * Only shown when user selects "Continue with Email".
 * 
 * LOCATION: core.ag (Angular-specific component)
 * 
 * Features:
 * - Email/password fields with validation
 * - Remember me checkbox
 * - Forgot password link (only visible for email auth)
 * - Back button to return to provider selection
 */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * Login credentials
 */
export interface EmailLoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
    selector: 'app-email-login-form',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="email-login-form">
      <!-- Back button -->
      @if (showBackButton) {
        <button
          type="button"
          class="btn btn-link text-muted p-0 mb-3 d-flex align-items-center gap-1"
          (click)="onBack()">
          <i class="ri-arrow-left-line"></i>
          <span>{{ backText }}</span>
        </button>
      }
    
      <!-- Form -->
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    
        <!-- Email -->
        <div class="mb-3">
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
                  <span>{{ emailRequiredError }}</span>
                }
                @if (f['email'].errors['email']) {
                  <span>{{ emailInvalidError }}</span>
                }
              </div>
            }
          </div>
    
          <!-- Password -->
          <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <label class="form-label" for="password">{{ passwordLabel }}</label>
              @if (showForgotPassword) {
                <a
                  [routerLink]="forgotPasswordRoute"
                  class="text-muted fs-13">
                  {{ forgotPasswordText }}
                </a>
              }
            </div>
            <div class="position-relative auth-pass-inputgroup">
              <input
                [type]="showPassword ? 'text' : 'password'"
                class="form-control pe-5"
                id="password"
                formControlName="password"
                [ngClass]="{ 'is-invalid': submitted && f['password'].errors }"
                [placeholder]="passwordPlaceholder">
                <button
                  type="button"
                  class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                  (click)="togglePassword()">
                  <i class="mdi align-middle"
                  [ngClass]="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></i>
                </button>
                @if (submitted && f['password'].errors) {
                  <div class="invalid-feedback">
                    @if (f['password'].errors['required']) {
                      <span>{{ passwordRequiredError }}</span>
                    }
                  </div>
                }
              </div>
            </div>
    
            <!-- Remember me -->
            <div class="form-check mb-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="rememberMe"
                formControlName="rememberMe">
                <label class="form-check-label" for="rememberMe">
                  {{ rememberMeText }}
                </label>
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
          </div>
    `,
    styles: [`
    .email-login-form {
      width: 100%;
    }

    .auth-pass-inputgroup input {
      padding-right: 2.5rem;
    }
  `]
})
export class EmailLoginFormComponent implements OnInit {
  
  // Text customization
  @Input() backText = 'Other sign in options';
  @Input() emailLabel = 'Email';
  @Input() emailPlaceholder = 'Enter your email';
  @Input() emailRequiredError = 'Email is required';
  @Input() emailInvalidError = 'Please enter a valid email';
  @Input() passwordLabel = 'Password';
  @Input() passwordPlaceholder = 'Enter your password';
  @Input() passwordRequiredError = 'Password is required';
  @Input() rememberMeText = 'Remember me';
  @Input() forgotPasswordText = 'Forgot password?';
  @Input() submitText = 'Sign In';

  // Configuration
  @Input() showBackButton = true;
  @Input() showForgotPassword = true;
  @Input() forgotPasswordRoute = '/auth/pass-reset';
  @Input() loading = false;
  @Input() errorMessage: string | null = null;

  // Default values (for dev convenience)
  @Input() defaultEmail = '';
  @Input() defaultPassword = '';

  // Events
  @Output() loginSubmit = new EventEmitter<EmailLoginCredentials>();
  @Output() backClicked = new EventEmitter<void>();

  // Form
  loginForm!: FormGroup;
  submitted = false;
  showPassword = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [this.defaultEmail, [Validators.required, Validators.email]],
      password: [this.defaultPassword, [Validators.required]],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onBack(): void {
    this.submitted = false;
    this.backClicked.emit();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loginSubmit.emit({
      email: this.f['email'].value,
      password: this.f['password'].value,
      rememberMe: this.f['rememberMe'].value
    });
  }
}
