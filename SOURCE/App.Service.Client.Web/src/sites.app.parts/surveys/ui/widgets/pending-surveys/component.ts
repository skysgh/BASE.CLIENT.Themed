/**
 * Pending Surveys Widget
 * 
 * Hub widget showing count of pending surveys.
 */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SurveyService } from '../../../services/survey.service';

@Component({
  selector: 'app-pending-surveys-widget',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="widget-card card h-100" routerLink="/apps/system/surveys" style="cursor: pointer;">
      <div class="card-body">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center">
            <div class="widget-icon bg-purple-subtle text-purple">
              <i class="bx bx-poll"></i>
            </div>
            <div class="ms-3">
              <h6 class="mb-0">Surveys</h6>
              <p class="text-muted small mb-0">Share your feedback</p>
            </div>
          </div>
          @if (surveyService.pendingSurveys().length > 0) {
            <span class="badge bg-primary">
              {{ surveyService.pendingSurveys().length }}
            </span>
          }
        </div>

        <!-- Stats -->
        <div class="widget-stats">
          @if (surveyService.loading()) {
            <div class="text-center py-2">
              <div class="spinner-border spinner-border-sm text-muted"></div>
            </div>
          } @else if (surveyService.pendingSurveys().length > 0) {
            <div class="d-flex align-items-center text-warning">
              <i class="bx bx-error-circle me-2"></i>
              <span class="small">
                {{ surveyService.pendingSurveys().length }} survey(s) waiting
              </span>
            </div>
            @if (surveyService.hasPendingRequired()) {
              <div class="d-flex align-items-center text-danger mt-1">
                <i class="bx bx-time-five me-2"></i>
                <span class="small">Required survey pending</span>
              </div>
            }
          } @else {
            <div class="d-flex align-items-center text-success">
              <i class="bx bx-check-circle me-2"></i>
              <span class="small">All surveys completed</span>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="widget-footer mt-3 pt-2 border-top text-end">
          <span class="text-primary small">
            View surveys <i class="bx bx-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .widget-card {
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
    }
    
    .widget-card:hover {
      border-color: var(--vz-primary);
      box-shadow: 0 4px 12px rgba(var(--vz-primary-rgb), 0.15);
      transform: translateY(-2px);
    }
    
    .widget-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .bg-purple-subtle {
      background-color: rgba(111, 66, 193, 0.1);
    }
    
    .text-purple {
      color: rgb(111, 66, 193);
    }
  `]
})
export class PendingSurveysWidgetComponent implements OnInit {
  surveyService = inject(SurveyService);

  ngOnInit(): void {
    // Load surveys if not already loaded
    if (this.surveyService.surveys().length === 0) {
      this.surveyService.loadAll();
    }
  }
}
