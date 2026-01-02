/**
 * Survey Response Service
 * 
 * Manages survey responses with branching logic.
 * Handles answer storage, validation, and navigation.
 */
import { Injectable, inject, signal, computed } from '@angular/core';
import { SurveyLogicService } from './survey-logic.service';
import { SurveyViewModel, QuestionGroupViewModel } from '../models/survey.view-model';
import { SurveyQuestionViewModel } from '../models/survey-question.view-model';
import { AnswerViewModel, SurveyResponseViewModel } from '../models/survey-response.view-model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class SurveyResponseService {
  private logicService = inject(SurveyLogicService);
  
  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────
  
  /** Current survey being taken */
  private _currentSurvey = signal<SurveyViewModel | null>(null);
  currentSurvey = this._currentSurvey.asReadonly();
  
  /** Current answers (questionId -> answer) */
  private _answers = signal<Map<string, AnswerViewModel>>(new Map());
  answers = this._answers.asReadonly();
  
  /** Current response ID */
  private _responseId = signal<string | null>(null);
  
  /** Started timestamp */
  private _startedAt = signal<Date | null>(null);
  
  // ─────────────────────────────────────────────────────────────
  // Computed
  // ─────────────────────────────────────────────────────────────
  
  /** Visible groups based on current answers */
  visibleGroups = computed(() => {
    const survey = this._currentSurvey();
    if (!survey) return [];
    return this.logicService.getVisibleGroups(survey.groups, this._answers());
  });
  
  /** Visible questions based on current answers */
  visibleQuestions = computed(() => {
    const survey = this._currentSurvey();
    if (!survey) return [];
    return this.logicService.getVisibleQuestions(survey.groups, this._answers());
  });
  
  /** Progress calculation */
  progress = computed(() => {
    const survey = this._currentSurvey();
    if (!survey) {
      return { 
        visibleQuestions: 0, 
        answeredQuestions: 0, 
        requiredQuestions: 0,
        requiredAnswered: 0,
        progress: 0, 
        isComplete: false 
      };
    }
    return this.logicService.calculateProgress(survey.groups, this._answers());
  });
  
  /** Is survey complete? */
  isComplete = computed(() => this.progress().isComplete);
  
  /** Progress percentage */
  progressPercent = computed(() => this.progress().progress);

  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────

  /**
   * Start taking a survey
   */
  startSurvey(survey: SurveyViewModel): void {
    this._currentSurvey.set(survey);
    this._answers.set(new Map());
    this._responseId.set(uuidv4());
    this._startedAt.set(new Date());
    
    console.log(`[SurveyResponseService] Started survey: ${survey.id}`);
  }

  /**
   * Set answer for a question
   */
  setAnswer(
    questionId: string, 
    value: string | string[] | number | Record<string, string>,
    questionText?: string
  ): void {
    const answer: AnswerViewModel = {
      questionId,
      questionText,
      value,
      displayValue: this.formatDisplayValue(value),
      skipped: false,
      answeredAt: new Date(),
    };
    
    this._answers.update(answers => {
      const newMap = new Map(answers);
      newMap.set(questionId, answer);
      return newMap;
    });
    
    console.log(`[SurveyResponseService] Answer set: ${questionId} = ${JSON.stringify(value)}`);
  }

  /**
   * Skip a question (for non-required questions)
   */
  skipQuestion(questionId: string): void {
    const answer: AnswerViewModel = {
      questionId,
      value: '',
      displayValue: '(skipped)',
      skipped: true,
      answeredAt: new Date(),
    };
    
    this._answers.update(answers => {
      const newMap = new Map(answers);
      newMap.set(questionId, answer);
      return newMap;
    });
  }

  /**
   * Clear answer for a question
   */
  clearAnswer(questionId: string): void {
    this._answers.update(answers => {
      const newMap = new Map(answers);
      newMap.delete(questionId);
      return newMap;
    });
  }

  /**
   * Get current answer for a question
   */
  getAnswer(questionId: string): AnswerViewModel | undefined {
    return this._answers().get(questionId);
  }

  /**
   * Validate current answers
   */
  validate(): { isValid: boolean; errors: Map<string, string[]> } {
    const errors = new Map<string, string[]>();
    const visibleQuestions = this.visibleQuestions();
    
    for (const question of visibleQuestions) {
      const answer = this._answers().get(question.id);
      const questionErrors: string[] = [];
      
      // Required check
      if (question.required && (!answer || answer.skipped)) {
        questionErrors.push('This field is required');
      }
      
      // Validation rules
      if (answer && !answer.skipped && question.validation) {
        const val = question.validation;
        const value = answer.value;
        
        if (typeof value === 'string') {
          if (val.minLength && value.length < val.minLength) {
            questionErrors.push(`Minimum ${val.minLength} characters required`);
          }
          if (val.maxLength && value.length > val.maxLength) {
            questionErrors.push(`Maximum ${val.maxLength} characters allowed`);
          }
          if (val.pattern && !new RegExp(val.pattern).test(value)) {
            questionErrors.push(val.patternMessage || 'Invalid format');
          }
        }
        
        if (typeof value === 'number') {
          if (val.minValue !== undefined && value < val.minValue) {
            questionErrors.push(`Minimum value is ${val.minValue}`);
          }
          if (val.maxValue !== undefined && value > val.maxValue) {
            questionErrors.push(`Maximum value is ${val.maxValue}`);
          }
        }
        
        if (Array.isArray(value)) {
          if (val.minSelections && value.length < val.minSelections) {
            questionErrors.push(`Select at least ${val.minSelections} options`);
          }
          if (val.maxSelections && value.length > val.maxSelections) {
            questionErrors.push(`Select at most ${val.maxSelections} options`);
          }
        }
      }
      
      if (questionErrors.length > 0) {
        errors.set(question.id, questionErrors);
      }
    }
    
    return {
      isValid: errors.size === 0,
      errors,
    };
  }

  /**
   * Submit survey response
   */
  async submit(): Promise<SurveyResponseViewModel | null> {
    const survey = this._currentSurvey();
    if (!survey) return null;
    
    const validation = this.validate();
    if (!validation.isValid) {
      console.error('[SurveyResponseService] Validation failed:', validation.errors);
      return null;
    }
    
    const response: SurveyResponseViewModel = {
      id: this._responseId()!,
      surveyId: survey.id,
      surveyTitle: survey.title,
      isAnonymous: !survey.allowAnonymous,
      startedAt: this._startedAt()!,
      completedAt: new Date(),
      durationSeconds: Math.floor(
        (Date.now() - this._startedAt()!.getTime()) / 1000
      ),
      status: 'completed',
      statusLabel: 'Completed',
      statusColor: 'success',
      answers: Array.from(this._answers().values()),
      answeredCount: this._answers().size,
      totalQuestions: this.visibleQuestions().length,
      progress: 100,
    };
    
    // TODO: Send to API
    console.log('[SurveyResponseService] Submitted:', response);
    
    // Clear state
    this.reset();
    
    return response;
  }

  /**
   * Abandon survey (save progress for later)
   */
  abandon(): void {
    // TODO: Save to local storage for resume
    console.log('[SurveyResponseService] Abandoned survey');
    this.reset();
  }

  /**
   * Reset service state
   */
  reset(): void {
    this._currentSurvey.set(null);
    this._answers.set(new Map());
    this._responseId.set(null);
    this._startedAt.set(null);
  }

  // ─────────────────────────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────────────────────────

  private formatDisplayValue(value: string | string[] | number | Record<string, string>): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');
    }
    return String(value);
  }
}
