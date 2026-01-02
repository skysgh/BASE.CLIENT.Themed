/**
 * Survey DTO
 * 
 * Wire format for surveys.
 */
import { SurveyType, SurveyStatus } from '../constants';
import { DisplayConditionDTO } from './display-condition.model';
import { SurveyQuestionDTO } from './survey-question.dto';

/**
 * Question Group DTO
 * 
 * Groups questions together with conditional display logic.
 */
export interface QuestionGroupDTO {
  /** Unique ID */
  id: string;
  
  /** Group title (optional) */
  title?: string;
  
  /** Group description (optional) */
  description?: string;
  
  /** Display order */
  order: number;
  
  /** Conditions that must be met to show this group */
  displayConditions: DisplayConditionDTO[];
  
  /** How to combine conditions */
  displayLogic: 'and' | 'or';
  
  /** Questions in this group */
  questions: SurveyQuestionDTO[];
}

/**
 * Survey DTO (wire format)
 */
export interface SurveyDTO {
  /** Unique ID */
  id: string;
  
  /** Survey title */
  title: string;
  
  /** Survey description */
  description?: string;
  
  /** Survey type */
  type: SurveyType;
  
  /** Survey status */
  status: SurveyStatus;
  
  /** When survey opens for responses */
  startDate?: string;
  
  /** When survey closes */
  endDate?: string;
  
  /** Allow anonymous responses */
  allowAnonymous: boolean;
  
  /** User must complete survey before proceeding */
  requiresCompletion: boolean;
  
  /** Maximum number of responses (null = unlimited) */
  maxResponses?: number;
  
  /** Estimated completion time in minutes */
  estimatedMinutes?: number;
  
  /** Thank you message shown after completion */
  thankYouMessage?: string;
  
  /** Redirect URL after completion */
  redirectUrl?: string;
  
  /** Question groups */
  groups: QuestionGroupDTO[];
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  
  // ─────────────────────────────────────────────────────────────
  // Timestamps
  // ─────────────────────────────────────────────────────────────
  
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}
