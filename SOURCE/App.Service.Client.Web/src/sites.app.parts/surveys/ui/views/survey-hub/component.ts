/**
 * Survey Hub Component
 * 
 * Main entry point for surveys.
 * Shows available surveys and pending survey notifications.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SurveyService } from '../../../services/survey.service';

@Component({
  selector: 'app-survey-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="survey-hub">
      <!-- Header -->
      <div class="hub-header mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-1">
              <i class="bx bx-poll me-2 text-primary"></i>
              Surveys
            </h4>
            <p class="text-muted mb-0">Share your feedback and help us improve</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      @if (surveyService.loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-2 text-muted">Loading surveys...</p>
        </div>
      }

      <!-- Pending Required Surveys Alert -->
      @if (surveyService.hasPendingRequired()) {
        <div class="alert alert-warning mb-4">
          <i class="bx bx-info-circle me-2"></i>
          <strong>Action Required:</strong> Please complete the required survey(s) below to continue.
        </div>
      }

      <!-- Active Surveys -->
      @if (!surveyService.loading()) {
        <h5 class="mb-3">
          <i class="bx bx-list-check me-2"></i>
          Available Surveys
          @if (surveyService.activeSurveys().length > 0) {
            <span class="badge bg-primary ms-2">{{ surveyService.activeSurveys().length }}</span>
          }
        </h5>

        <div class="row g-4">
          @for (survey of surveyService.activeSurveys(); track survey.id) {
            <div class="col-md-6 col-lg-4">
              <div class="card h-100 survey-card" [class.border-warning]="survey.requiresCompletion">
                <div class="card-body">
                  <!-- Type badge -->
                  <div class="mb-3">
                    <span class="badge bg-{{ survey.statusColor }}-subtle text-{{ survey.statusColor }}">
                      {{ survey.typeLabel }}
                    </span>
                    @if (survey.requiresCompletion) {
                      <span class="badge bg-warning ms-1">Required</span>
                    }
                  </div>

                  <!-- Title -->
                  <h5 class="card-title">{{ survey.title }}</h5>
                  
                  <!-- Description -->
                  @if (survey.description) {
                    <p class="card-text text-muted small">{{ survey.description }}</p>
                  }

                  <!-- Meta info -->
                  <div class="d-flex gap-3 text-muted small mb-3">
                    @if (survey.estimatedMinutes) {
                      <span>
                        <i class="bx bx-time-five me-1"></i>
                        ~{{ survey.estimatedMinutes }} min
                      </span>
                    }
                    <span>
                      <i class="bx bx-question-mark me-1"></i>
                      {{ survey.totalQuestions }} questions
                    </span>
                  </div>

                  <!-- Days remaining -->
                  @if (survey.daysRemaining !== undefined) {
                    <div class="text-muted small mb-3">
                      <i class="bx bx-calendar me-1"></i>
                      {{ survey.daysRemaining }} days remaining
                    </div>
                  }

                  <!-- Action -->
                  <a [routerLink]="['take', survey.id]" class="btn btn-primary w-100">
                    Start Survey
                    <i class="bx bx-right-arrow-alt ms-1"></i>
                  </a>
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-12">
              <div class="card">
                <div class="card-body text-center py-5">
                  <i class="bx bx-check-circle text-success fs-48"></i>
                  <h5 class="mt-3">All caught up!</h5>
                  <p class="text-muted">No surveys available right now.</p>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Admin Link (if authorized) -->
      <div class="mt-5 pt-4 border-top">
        <a routerLink="admin" class="btn btn-outline-secondary">
          <i class="bx bx-cog me-1"></i>
          Manage Surveys
        </a>
      </div>
    </div>
  `,
  styles: [`
    .survey-hub {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .survey-card {
      transition: all 0.2s ease;
    }
    
    .survey-card:hover {
      border-color: var(--vz-primary);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  `]
})
export class SurveyHubComponent implements OnInit {
  private _surveyService = inject(SurveyService);
  
  // Expose for template
  get surveyService() { return this._surveyService; }

  ngOnInit(): void {
    this._surveyService.loadAll();
  }
}
