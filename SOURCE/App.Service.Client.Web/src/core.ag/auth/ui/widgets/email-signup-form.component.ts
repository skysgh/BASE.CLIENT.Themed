/**
 * Email Signup Form Component
 * 
 * Registration form for email/password sign up.
 * Creates User + DigitalIdentity in the system.
 * 
 * Note: First/Last name are NOT collected here.
 * User display name defaults to "New User" - they can update in settings later.
 * Person details (name, etc.) are collected separately when user sets up profile.
 * 
 * LOCATION: core.ag (Angular-specific component)
 */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * Signup request data
 * 
 * Note: firstName/lastName are optional - defaults to "New User" display name
 */
export interface EmailSignupRequest {
  email: string;
  password: string;
  acceptTerms: boolean;
  // Optional - for backward compatibility with components that pass names
  firstName?: string;
  lastName?: string;
}

@Component({
  selector: 'app-email-signup-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="email-signup-form">
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
      <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">

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
                <span>Email is required</span>
              }
              @if (f['email'].errors['email']) {
                <span>Please enter a valid email</span>
              }
            </div>
          }
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label" for="password">{{ passwordLabel }}</label>
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
                  <span>Password is required</span>
                }
                @if (f['password'].errors['minlength']) {
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
        <div class="mb-3">
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

        <!-- Terms checkbox -->
        <div class="form-check mb-3">
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="acceptTerms"
            formControlName="acceptTerms"
            [ngClass]="{ 'is-invalid': submitted && f['acceptTerms'].errors }">
          <label class="form-check-label" for="acceptTerms">
            I agree to the <a [routerLink]="termsRoute" class="text-primary">Terms of Service</a> 
            and <a [routerLink]="privacyRoute" class="text-primary">Privacy Policy</a>
          </label>
          @if (submitted && f['acceptTerms'].errors) {
            <div class="invalid-feedback">
              <span>You must accept the terms to continue</span>
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

        <!-- Sign in link (inside form/card) -->
        <div class="mt-4 text-center">
          <p class="mb-0 text-muted">
            Already have an account? 
            <a [routerLink]="signInRoute" class="fw-semibold text-primary">Sign In</a>
          </p>
        </div>

      </form>
    </div>
  `,
  styles: [`
    .email-signup-form {
      width: 100%;
    }

    .auth-pass-inputgroup input {
      padding-right: 2.5rem;
    }
  `]
})
export class EmailSignupFormComponent implements OnInit {
  
  // Labels
  @Input() emailLabel = 'Email';
  @Input() emailPlaceholder = 'Enter your email';
  @Input() passwordLabel = 'Password';
  @Input() passwordPlaceholder = 'Create a password';
  @Input() confirmPasswordLabel = 'Confirm Password';
  @Input() confirmPasswordPlaceholder = 'Confirm your password';
  @Input() submitText = 'Create Account';
  @Input() backText = 'Other sign up options';

  // Configuration
  @Input() showBackButton = true;
  @Input() loading = false;
  @Input() errorMessage: string | null = null;
  @Input() termsRoute = '/pages/terms';
  @Input() privacyRoute = '/pages/privacy';
  @Input() signInRoute = '/auth/signin';

  // Events
  @Output() signupSubmit = new EventEmitter<EmailSignupRequest>();
  @Output() backClicked = new EventEmitter<void>();

  // Form
  signupForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Custom validator for password match
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  get f() {
    return this.signupForm.controls;
  }

  /**
   * Password strength calculation
   */
  get passwordStrength(): number {
    const password = this.f['password'].value || '';
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

  onBack(): void {
    this.submitted = false;
    this.backClicked.emit();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    this.signupSubmit.emit({
      email: this.f['email'].value,
      password: this.f['password'].value,
      acceptTerms: this.f['acceptTerms'].value,
      // Default display name - user can change later in settings
      firstName: 'New',
      lastName: 'User'
    });
  }
}
