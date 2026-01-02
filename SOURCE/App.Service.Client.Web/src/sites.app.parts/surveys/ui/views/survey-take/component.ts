/**
 * Survey Take Component
 * 
 * Interactive survey form with conditional branching.
 * Shows/hides question groups based on previous answers.
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SurveyService } from '../../../services/survey.service';
import { SurveyResponseService } from '../../../services/survey-response.service';
import { SurveyLogicService } from '../../../services/survey-logic.service';
import { SurveyViewModel } from '../../../models/survey.view-model';
import { SurveyQuestionViewModel } from '../../../models/survey-question.view-model';

@Component({
  selector: 'app-survey-take',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="survey-take">
      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-2 text-muted">Loading survey...</p>
        </div>
      }

      @if (error()) {
        <div class="alert alert-danger">
          <i class="bx bx-error-circle me-2"></i>
          {{ error() }}
        </div>
      }

      @if (survey() && !loading()) {
        <!-- Header -->
        <div class="survey-header mb-4">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h4 class="mb-1">{{ survey()!.title }}</h4>
              @if (survey()!.description) {
                <p class="text-muted mb-0">{{ survey()!.description }}</p>
              }
            </div>
            <button class="btn btn-outline-secondary" (click)="cancel()">
              <i class="bx bx-x"></i>
            </button>
          </div>
          
          <!-- Progress Bar -->
          <div class="progress mt-3" style="height: 8px;">
            <div 
              class="progress-bar" 
              [style.width.%]="responseService.progressPercent()"
              [class.bg-success]="responseService.isComplete()">
            </div>
          </div>
          <small class="text-muted">
            {{ responseService.progress().answeredQuestions }} of 
            {{ responseService.progress().visibleQuestions }} questions answered
            ({{ responseService.progressPercent() }}%)
          </small>
        </div>

        <!-- Question Groups -->
        @for (group of responseService.visibleGroups(); track group.id) {
          <div class="question-group card mb-4">
            @if (group.title) {
              <div class="card-header">
                <h5 class="mb-0">{{ group.title }}</h5>
                @if (group.description) {
                  <p class="text-muted mb-0 small">{{ group.description }}</p>
                }
              </div>
            }
            <div class="card-body">
              @for (question of group.questions; track question.id) {
                @if (shouldShowQuestion(question)) {
                  <div class="question mb-4" [class.has-error]="hasError(question.id)">
                    <!-- Question Text -->
                    <label class="form-label fw-medium">
                      {{ question.text }}
                      @if (question.required) {
                        <span class="text-danger">*</span>
                      }
                    </label>
                    
                    @if (question.helpText) {
                      <p class="text-muted small">{{ question.helpText }}</p>
                    }

                    <!-- Question Input by Type -->
                    @switch (question.type) {
                      @case ('single') {
                        <div class="d-flex flex-column gap-2">
                          @for (option of question.options; track option.id) {
                            <div class="form-check">
                              <input 
                                type="radio" 
                                class="form-check-input"
                                [id]="question.id + '-' + option.id"
                                [name]="question.id"
                                [value]="option.value"
                                [checked]="getAnswer(question.id) === option.value"
                                (change)="setAnswer(question, option.value)">
                              <label class="form-check-label" [for]="question.id + '-' + option.id">
                                {{ option.text }}
                              </label>
                            </div>
                          }
                        </div>
                      }
                      
                      @case ('multiple') {
                        <div class="d-flex flex-column gap-2">
                          @for (option of question.options; track option.id) {
                            <div class="form-check">
                              <input 
                                type="checkbox" 
                                class="form-check-input"
                                [id]="question.id + '-' + option.id"
                                [checked]="isSelected(question.id, option.value)"
                                (change)="toggleOption(question, option.value, $event)">
                              <label class="form-check-label" [for]="question.id + '-' + option.id">
                                {{ option.text }}
                              </label>
                            </div>
                          }
                        </div>
                      }
                      
                      @case ('scale') {
                        <div class="scale-input">
                          <div class="d-flex justify-content-between mb-2">
                            @for (value of question.scaleValues; track value) {
                              <button 
                                type="button"
                                class="btn scale-btn"
                                [class.btn-primary]="getAnswer(question.id) === value"
                                [class.btn-outline-secondary]="getAnswer(question.id) !== value"
                                (click)="setAnswer(question, value)">
                                {{ value }}
                              </button>
                            }
                          </div>
                          <div class="d-flex justify-content-between text-muted small">
                            <span>{{ question.scaleLabels[question.scaleMin] || question.scaleMin }}</span>
                            <span>{{ question.scaleLabels[question.scaleMax] || question.scaleMax }}</span>
                          </div>
                        </div>
                      }
                      
                      @case ('rating') {
                        <div class="rating-input">
                          @for (value of question.ratingValues; track value) {
                            <button 
                              type="button"
                              class="btn btn-link p-1"
                              (click)="setAnswer(question, value)">
                              <i 
                                class="bx fs-24"
                                [class.bxs-star]="isRatingSelected(question.id, value)"
                                [class.bx-star]="!isRatingSelected(question.id, value)"
                                [class.text-warning]="isRatingSelected(question.id, value)"
                                [class.text-muted]="!isRatingSelected(question.id, value)">
                              </i>
                            </button>
                          }
                        </div>
                      }
                      
                      @case ('text') {
                        @if (question.textType === 'long') {
                          <textarea 
                            class="form-control"
                            rows="4"
                            [placeholder]="question.placeholder || ''"
                            [value]="getAnswer(question.id) || ''"
                            (input)="setAnswer(question, $any($event.target).value)">
                          </textarea>
                        } @else {
                          <input 
                            type="text"
                            class="form-control"
                            [placeholder]="question.placeholder || ''"
                            [value]="getAnswer(question.id) || ''"
                            (input)="setAnswer(question, $any($event.target).value)">
                        }
                      }
                    }

                    <!-- Validation Errors -->
                    @if (hasError(question.id)) {
                      <div class="text-danger small mt-1">
                        @for (err of getErrors(question.id); track err) {
                          <div>{{ err }}</div>
                        }
                      </div>
                    }
                  </div>
                }
              }
            </div>
          </div>
        }

        <!-- Submit -->
        <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <button class="btn btn-outline-secondary" (click)="cancel()">
            Cancel
          </button>
          <div class="d-flex gap-2">
            @if (!responseService.isComplete()) {
              <span class="text-muted align-self-center me-2">
                {{ responseService.progress().requiredQuestions - responseService.progress().requiredAnswered }} 
                required questions remaining
              </span>
            }
            <button 
              class="btn btn-primary"
              [disabled]="!responseService.isComplete() || submitting()"
              (click)="submit()">
              @if (submitting()) {
                <span class="spinner-border spinner-border-sm me-1"></span>
              }
              Submit
              <i class="bx bx-check ms-1"></i>
            </button>
          </div>
        </div>
      }

      <!-- Completion Message -->
      @if (completed()) {
        <div class="text-center py-5">
          <div class="success-icon mb-4">
            <i class="bx bx-check-circle text-success fs-48"></i>
          </div>
          <h4>Thank you!</h4>
          <p class="text-muted">{{ survey()?.thankYouMessage || 'Your response has been submitted.' }}</p>
          <button class="btn btn-primary" routerLink="..">
            Back to Surveys
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .survey-take {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .scale-btn {
      min-width: 40px;
    }
    
    .question.has-error .form-control {
      border-color: var(--vz-danger);
    }
    
    .rating-input button:hover i {
      color: var(--vz-warning) !important;
    }
  `]
})
export class SurveyTakeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  surveyService = inject(SurveyService);
  responseService = inject(SurveyResponseService);
  private logicService = inject(SurveyLogicService);

  survey = signal<SurveyViewModel | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  completed = signal(false);
  validationErrors = signal<Map<string, string[]>>(new Map());

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Survey not found');
      this.loading.set(false);
      return;
    }

    try {
      const survey = await this.surveyService.getById(id);
      if (!survey) {
        this.error.set('Survey not found');
      } else if (!survey.isOpen) {
        this.error.set('This survey is no longer accepting responses');
      } else {
        this.survey.set(survey);
        this.responseService.startSurvey(survey);
      }
    } catch (err) {
      this.error.set('Failed to load survey');
    } finally {
      this.loading.set(false);
    }
  }

  shouldShowQuestion(question: SurveyQuestionViewModel): boolean {
    return this.logicService.shouldShowQuestion(question, this.responseService.answers());
  }

  getAnswer(questionId: string): string | string[] | number | Record<string, string> | undefined {
    return this.responseService.getAnswer(questionId)?.value;
  }

  setAnswer(question: SurveyQuestionViewModel, value: string | number): void {
    this.responseService.setAnswer(question.id, value, question.text);
  }

  isSelected(questionId: string, optionValue: string): boolean {
    const answer = this.getAnswer(questionId);
    return Array.isArray(answer) && answer.includes(optionValue);
  }

  isRatingSelected(questionId: string, value: number): boolean {
    const answer = this.getAnswer(questionId);
    return typeof answer === 'number' && answer >= value;
  }

  toggleOption(question: SurveyQuestionViewModel, optionValue: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this.getAnswer(question.id);
    const values = Array.isArray(current) ? [...current] : [];
    
    if (checked) {
      values.push(optionValue);
    } else {
      const index = values.indexOf(optionValue);
      if (index >= 0) values.splice(index, 1);
    }
    
    this.responseService.setAnswer(question.id, values, question.text);
  }

  hasError(questionId: string): boolean {
    return this.validationErrors().has(questionId);
  }

  getErrors(questionId: string): string[] {
    return this.validationErrors().get(questionId) || [];
  }

  async submit(): Promise<void> {
    const validation = this.responseService.validate();
    
    if (!validation.isValid) {
      this.validationErrors.set(validation.errors);
      return;
    }
    
    this.submitting.set(true);
    try {
      await this.responseService.submit();
      this.completed.set(true);
      
      // Redirect if configured
      if (this.survey()?.redirectUrl) {
        window.location.href = this.survey()!.redirectUrl!;
      }
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.responseService.abandon();
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
