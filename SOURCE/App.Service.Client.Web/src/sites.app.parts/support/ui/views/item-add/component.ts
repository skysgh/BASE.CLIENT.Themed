/**
 * Item Add Component
 * 
 * BREAD: Add view for submitting new issues/ideas/praise.
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SupportItemService } from '../../../services';
import { NavigationService } from '../../../../../core/services/navigation.service';
import { SUPPORT_ITEM_TYPES, SUPPORT_PRIORITIES, SupportItemType, SupportPriority } from '../../../constants';

/** Testimonial consent options */
type TestimonialConsent = 'none' | 'credited' | 'anonymous';

@Component({
  selector: 'app-item-add',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="item-add">
      <!-- Header with Actions on Right -->
      <div class="page-header mb-4">
        <div class="d-flex justify-content-between align-items-start">
          <!-- Title -->
          <div>
            <div class="d-flex align-items-center gap-3">
              <div class="type-icon" [style.background-color]="typeConfig?.color + '20'">
                <i class="bx {{ typeConfig?.icon }}" [style.color]="typeConfig?.color"></i>
              </div>
              <div>
                <h4 class="mb-1">{{ pageTitle }}</h4>
                <p class="text-muted mb-0">{{ typeConfig?.description }}</p>
              </div>
            </div>
          </div>
          
          <!-- Actions (Right Side) -->
          <div class="d-flex gap-2 align-items-center">
            <button type="button" class="btn btn-outline-secondary" (click)="cancel()">
              Cancel
            </button>
            <button 
              type="button" 
              class="btn"
              [class.btn-danger]="itemType === 'issue'"
              [class.btn-primary]="itemType === 'idea'"
              [class.btn-success]="itemType === 'praise'"
              [disabled]="form.invalid || supportService.saving()"
              (click)="onSubmit()">
              @if (supportService.saving()) {
                <span class="spinner-border spinner-border-sm me-1"></span>
                Submitting...
              } @else {
                <i class="bx bx-send me-1"></i>
                Submit
              }
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      @if (submitted()) {
        <div class="alert alert-success d-flex align-items-center">
          <i class="bx bx-check-circle fs-20 me-2"></i>
          <div>
            <strong>Thank you!</strong> Your {{ itemTypeName }} has been submitted.
            <a (click)="goToBrowse()" class="alert-link" style="cursor: pointer;">
              Back to Support
            </a>
          </div>
        </div>
      }

      <!-- Form -->
      @if (!submitted()) {
        <div class="card">
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <!-- Title -->
              <div class="mb-3">
                <label class="form-label">Title <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="title"
                  [placeholder]="titlePlaceholder"
                  [class.is-invalid]="form.get('title')?.invalid && form.get('title')?.touched">
                @if (form.get('title')?.invalid && form.get('title')?.touched) {
                  <div class="invalid-feedback">
                    Title is required (min 5 characters)
                  </div>
                }
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label">{{ descriptionLabel }} <span class="text-danger">*</span></label>
                <textarea
                  class="form-control"
                  formControlName="description"
                  rows="5"
                  [placeholder]="descriptionPlaceholder"
                  [class.is-invalid]="form.get('description')?.invalid && form.get('description')?.touched">
                </textarea>
                @if (form.get('description')?.invalid && form.get('description')?.touched) {
                  <div class="invalid-feedback">
                    {{ descriptionLabel }} is required (min 20 characters)
                  </div>
                }
                <div class="form-text">
                  Be as detailed as possible.
                </div>
              </div>

              <!-- Priority (not for praise) -->
              @if (itemType !== 'praise') {
                <div class="mb-3">
                  <label class="form-label">Priority</label>
                  <div class="d-flex gap-2 flex-wrap">
                    @for (priority of priorities; track priority.id) {
                      <div class="form-check form-check-inline">
                        <input 
                          type="radio" 
                          class="btn-check" 
                          [id]="'priority-' + priority.id"
                          formControlName="priority"
                          [value]="priority.id">
                        <label 
                          class="btn btn-outline-secondary btn-sm"
                          [for]="'priority-' + priority.id"
                          [class.active]="form.get('priority')?.value === priority.id">
                          <i class="bx {{ priority.icon }} me-1" [style.color]="priority.color"></i>
                          {{ priority.name }}
                        </label>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Testimonial Consent (for praise only) -->
              @if (itemType === 'praise') {
                <div class="mb-3">
                  <label class="form-label">May we share your feedback?</label>
                  <select class="form-select" formControlName="testimonialConsent">
                    <option value="none">No, keep it private</option>
                    <option value="credited">Yes, with my name</option>
                    <option value="anonymous">Yes, but anonymously</option>
                  </select>
                  <div class="form-text">
                    If shared, your feedback may appear on our website as a testimonial.
                  </div>
                </div>

                <!-- Quote (if sharing) -->
                @if (form.get('testimonialConsent')?.value !== 'none') {
                  <div class="mb-3">
                    <label class="form-label">
                      Short quote (optional)
                      <span class="text-muted fw-normal">- for display on website</span>
                    </label>
                    <textarea
                      class="form-control"
                      formControlName="testimonialQuote"
                      rows="2"
                      placeholder="A brief sentence summarizing your experience..."
                      maxlength="200">
                    </textarea>
                    <div class="form-text d-flex justify-content-between">
                      <span>We may use this as a testimonial quote.</span>
                      <span>{{ form.get('testimonialQuote')?.value?.length || 0 }}/200</span>
                    </div>
                  </div>
                }
              }

              <!-- Category (not for praise) -->
              @if (itemType !== 'praise') {
                <div class="mb-4">
                  <label class="form-label">Category (optional)</label>
                  <select class="form-select" formControlName="category">
                    <option value="">Select a category...</option>
                    @for (cat of categories; track cat) {
                      <option [value]="cat">{{ cat }}</option>
                    }
                  </select>
                </div>
              }
            </form>

            <!-- Error -->
            @if (supportService.error()) {
              <div class="alert alert-danger mt-3">
                {{ supportService.error() }}
              </div>
            }
          </div>
        </div>

        <!-- Tips -->
        <div class="tips-section mt-4">
          <h6 class="text-muted">
            <i class="bx bx-info-circle me-1"></i>
            Tips for a good {{ itemTypeName }}
          </h6>
          <ul class="text-muted small">
            @if (itemType === 'issue') {
              <li>Include steps to reproduce the problem</li>
              <li>Mention your browser and operating system</li>
              <li>Describe what you expected vs. what happened</li>
              <li>Include any error messages you saw</li>
            } @else if (itemType === 'idea') {
              <li>Explain the problem your idea solves</li>
              <li>Describe how you envision it working</li>
              <li>Share any examples from other products</li>
              <li>Explain why this would benefit other users</li>
            } @else {
              <li>Tell us what made your experience great</li>
              <li>Mention specific features or people that helped</li>
              <li>Share how we've made a difference for you</li>
              <li>Your kind words help motivate our team!</li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: [`
    .item-add {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .type-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
    }
    
    .btn-check:checked + .btn-outline-secondary {
      background-color: var(--vz-secondary);
      color: white;
    }
  `]
})
export class ItemAddComponent implements OnInit {
  supportService = inject(SupportItemService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private navigationService = inject(NavigationService);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  itemType: SupportItemType = 'issue';
  priorities = SUPPORT_PRIORITIES;
  submitted = signal(false);
  
  categories = [
    'Authentication',
    'UI/UX',
    'Performance',
    'Reports',
    'Data',
    'Security',
    'Mobile',
    'Other',
  ];

  ngOnInit(): void {
    // Get type from route
    this.route.params.subscribe(params => {
      const type = params['type'];
      if (type === 'issue' || type === 'idea' || type === 'praise') {
        this.itemType = type;
      }
    });

    // Initialize form
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      priority: ['medium'],
      category: [''],
      testimonialConsent: ['none'],
      testimonialQuote: [''],
    });
  }

  get pageTitle(): string {
    switch (this.itemType) {
      case 'issue': return 'Report an Issue';
      case 'idea': return 'Share an Idea';
      case 'praise': return 'Share Praise';
      default: return 'Submit Feedback';
    }
  }

  get itemTypeName(): string {
    switch (this.itemType) {
      case 'issue': return 'issue';
      case 'idea': return 'idea';
      case 'praise': return 'feedback';
      default: return 'submission';
    }
  }

  get titlePlaceholder(): string {
    switch (this.itemType) {
      case 'issue': return 'Brief description of the issue';
      case 'idea': return 'Your idea in a few words';
      case 'praise': return 'What would you like to praise?';
      default: return 'Title';
    }
  }

  get descriptionLabel(): string {
    switch (this.itemType) {
      case 'praise': return 'Your feedback';
      default: return 'Description';
    }
  }

  get descriptionPlaceholder(): string {
    switch (this.itemType) {
      case 'issue': return 'Describe what happened, steps to reproduce, etc.';
      case 'idea': return 'Explain your idea and why it would be useful';
      case 'praise': return 'Tell us about your great experience...';
      default: return 'Describe your feedback...';
    }
  }

  get typeConfig() {
    return SUPPORT_ITEM_TYPES.find(t => t.id === this.itemType);
  }

  cancel(): void {
    // Use replaceUrl to avoid adding this form page to browser history
    // This way, Back from Support Hub won't return here
    this.navigationService.navigate('apps/system/support', undefined, { replaceUrl: true });
  }

  goToBrowse(): void {
    // Navigate back to support hub
    this.navigationService.navigate('apps/system/support');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description, priority, category, testimonialConsent, testimonialQuote } = this.form.value;
    
    this.supportService.submit(
      this.itemType,
      title,
      description,
      this.itemType === 'praise' ? 'medium' : priority as SupportPriority,
      category || undefined
    ).subscribe(item => {
      if (item) {
        // Show success message
        this.submitted.set(true);
        
        // Auto-navigate after delay
        setTimeout(() => {
          this.goToBrowse();
        }, 2000);
      }
    });
  }
}
