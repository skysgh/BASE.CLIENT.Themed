/**
 * Survey Response ViewModel
 * 
 * UI format for survey responses.
 */

/**
 * Individual Answer ViewModel
 */
export interface AnswerViewModel {
  questionId: string;
  questionText?: string;  // For display
  value: string | string[] | number | Record<string, string>;
  displayValue: string;  // Formatted for display
  skipped: boolean;
  answeredAt?: Date;
}

/**
 * Survey Response ViewModel (UI format)
 */
export interface SurveyResponseViewModel {
  id: string;
  surveyId: string;
  surveyTitle?: string;
  
  // Respondent
  respondentId?: string;
  respondentName?: string;
  isAnonymous: boolean;
  
  // Timing
  startedAt: Date;
  completedAt?: Date;
  durationSeconds?: number;
  durationFormatted?: string;  // "5 min 23 sec"
  
  // Status
  status: 'in_progress' | 'completed' | 'abandoned';
  statusLabel: string;
  statusColor: string;
  
  // Answers
  answers: AnswerViewModel[];
  answeredCount: number;
  totalQuestions: number;
  progress: number;  // 0-100
  
  // Metadata
  metadata?: Record<string, unknown>;
}

/**
 * Survey Results ViewModel
 * 
 * Aggregated results for display.
 */
export interface SurveyResultsViewModel {
  surveyId: string;
  surveyTitle: string;
  
  // Summary stats
  totalResponses: number;
  completedResponses: number;
  abandonedResponses: number;
  completionRate: number;
  completionRateFormatted: string;
  averageDuration: string;  // "4 min 32 sec"
  
  // Per-question results
  questions: QuestionResultViewModel[];
  
  // Time series (for charts)
  responsesOverTime?: { date: Date; count: number }[];
}

/**
 * Question Result ViewModel
 */
export interface QuestionResultViewModel {
  questionId: string;
  questionText: string;
  questionType: string;
  responseCount: number;
  skipCount: number;
  skipRate: number;
  
  // For choice questions
  options?: {
    text: string;
    count: number;
    percentage: number;
  }[];
  
  // For scale/rating
  average?: number;
  averageFormatted?: string;
  min?: number;
  max?: number;
  distribution?: {
    value: number;
    count: number;
    percentage: number;
  }[];
  
  // NPS specific
  npsScore?: number;
  promoters?: number;
  passives?: number;
  detractors?: number;
  
  // For text questions
  wordCloud?: { word: string; count: number }[];
  sampleResponses?: string[];
}
