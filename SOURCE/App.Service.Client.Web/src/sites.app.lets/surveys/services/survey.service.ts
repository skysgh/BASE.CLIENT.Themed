/**
 * Survey Service
 * 
 * Business logic for survey management.
 */
import { Injectable, inject, signal, computed } from '@angular/core';
import { SurveyRepository } from '../repositories/survey.repository';
import { SurveyMapper } from '../mappers/survey.mapper';
import { SurveyDTO } from '../models/survey.dto';
import { SurveyViewModel } from '../models/survey.view-model';
import { SurveyStatus, SurveyType } from '../constants';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private repository = inject(SurveyRepository);
  
  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  
  /** All surveys */
  private _surveys = signal<SurveyViewModel[]>([]);
  surveys = this._surveys.asReadonly();
  
  /** Loading state */
  private _loading = signal(false);
  loading = this._loading.asReadonly();
  
  /** Error state */
  private _error = signal<string | null>(null);
  error = this._error.asReadonly();
  
  // ─────────────────────────────────────────────────────────────
  // Computed
  // ─────────────────────────────────────────────────────────────
  
  /** Active surveys */
  activeSurveys = computed(() => 
    this._surveys().filter(s => s.status === 'active' && s.isOpen)
  );
  
  /** Pending surveys for current user */
  pendingSurveys = computed(() => 
    this.activeSurveys().filter(s => !s.isComplete)
  );
  
  /** Survey count by status */
  countByStatus = computed(() => {
    const surveys = this._surveys();
    return {
      draft: surveys.filter(s => s.status === 'draft').length,
      active: surveys.filter(s => s.status === 'active').length,
      closed: surveys.filter(s => s.status === 'closed').length,
      archived: surveys.filter(s => s.status === 'archived').length,
    };
  });

  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────

  /**
   * Load all surveys
   */
  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    
    try {
      const dtos = await this.repository.getAll();
      const viewModels = dtos.map(dto => SurveyMapper.toViewModel(dto));
      this._surveys.set(viewModels);
    } catch (err) {
      this._error.set('Failed to load surveys');
      console.error('Error loading surveys:', err);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Get survey by ID
   */
  async getById(id: string): Promise<SurveyViewModel | null> {
    const cached = this._surveys().find(s => s.id === id);
    if (cached) return cached;
    
    this._loading.set(true);
    try {
      const dto = await this.repository.getById(id);
      return dto ? SurveyMapper.toViewModel(dto) : null;
    } catch (err) {
      console.error('Error loading survey:', err);
      return null;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Load active surveys for user
   */
  async loadActiveForUser(userId: string): Promise<void> {
    this._loading.set(true);
    try {
      const dtos = await this.repository.getActiveForUser(userId);
      const viewModels = dtos.map(dto => SurveyMapper.toViewModel(dto));
      this._surveys.set(viewModels);
    } catch (err) {
      this._error.set('Failed to load surveys');
      console.error('Error loading user surveys:', err);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Save survey (create or update)
   */
  async save(survey: SurveyViewModel): Promise<SurveyViewModel> {
    this._loading.set(true);
    try {
      const dto = SurveyMapper.toDTO(survey);
      const savedDto = await this.repository.save(dto);
      const savedVm = SurveyMapper.toViewModel(savedDto);
      
      // Update cache
      this._surveys.update(surveys => {
        const index = surveys.findIndex(s => s.id === savedVm.id);
        if (index >= 0) {
          return [...surveys.slice(0, index), savedVm, ...surveys.slice(index + 1)];
        }
        return [...surveys, savedVm];
      });
      
      return savedVm;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Delete survey
   */
  async delete(id: string): Promise<void> {
    this._loading.set(true);
    try {
      await this.repository.delete(id);
      this._surveys.update(surveys => surveys.filter(s => s.id !== id));
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Update survey status
   */
  async updateStatus(id: string, status: SurveyStatus): Promise<void> {
    const survey = await this.getById(id);
    if (survey) {
      await this.save({ ...survey, status });
    }
  }

  /**
   * Check if user has pending required surveys
   */
  hasPendingRequired(): boolean {
    return this.pendingSurveys().some(s => s.requiresCompletion);
  }
}
