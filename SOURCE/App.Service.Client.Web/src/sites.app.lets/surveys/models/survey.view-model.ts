/**
 * Survey ViewModel
 * 
 * UI format for surveys with computed properties.
 */
import { 
  SurveyType, 
  SurveyStatus, 
  SURVEY_TYPE_LABELS, 
  SURVEY_STATUS_LABELS, 
  SURVEY_STATUS_COLORS 
} from '../constants';
import { DisplayConditionViewModel } from './display-condition.model';
import { SurveyQuestionViewModel } from './survey-question.view-model';

/**
 * Question Group ViewModel
 */
export interface QuestionGroupViewModel {
  id: string;
  title?: string;
  description?: string;
  order: number;
  displayConditions: DisplayConditionViewModel[];
  displayLogic: 'and' | 'or';
  questions: SurveyQuestionViewModel[];
  
  // Computed
  hasConditions: boolean;
  isVisible: boolean;  // Current visibility based on answers
  questionCount: number;
  answeredCount: number;
  progress: number;  // 0-100
}

/**
 * Survey ViewModel (UI format)
 */
export interface SurveyViewModel {
  id: string;
  title: string;
  description?: string;
  type: SurveyType;
  typeLabel: string;
  status: SurveyStatus;
  statusLabel: string;
  statusColor: string;
  
  // Dates
  startDate?: Date;
  endDate?: Date;
  isOpen: boolean;  // Computed: status === 'active' && within date range
  daysRemaining?: number;
  
  // Settings
  allowAnonymous: boolean;
  requiresCompletion: boolean;
  maxResponses?: number;
  currentResponses?: number;
  isFull: boolean;  // Computed: currentResponses >= maxResponses
  estimatedMinutes?: number;
  thankYouMessage?: string;
  redirectUrl?: string;
  
  // Groups and questions
  groups: QuestionGroupViewModel[];
  
  // Computed totals
  totalQuestions: number;
  visibleQuestions: number;  // Questions currently visible based on conditions
  answeredQuestions: number;
  requiredQuestions: number;
  requiredAnswered: number;
  progress: number;  // Overall progress 0-100
  isComplete: boolean;  // All required questions answered
  
  // Timestamps
  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  
  // Response state (when taking survey)
  responseId?: string;
  startedAt?: Date;
  
  // Metadata
  metadata?: Record<string, unknown>;
}
