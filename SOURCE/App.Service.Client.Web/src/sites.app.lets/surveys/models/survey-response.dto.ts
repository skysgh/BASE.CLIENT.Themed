/**
 * Survey Response DTO
 * 
 * Wire format for survey responses.
 */

/**
 * Individual Answer DTO
 */
export interface AnswerDTO {
  /** Question ID */
  questionId: string;
  
  /** Answer value (type depends on question type) */
  value: string | string[] | number | Record<string, string>;
  
  /** Was question skipped (for non-required questions) */
  skipped: boolean;
  
  /** Timestamp when answered */
  answeredAt?: string;
}

/**
 * Survey Response DTO (wire format)
 */
export interface SurveyResponseDTO {
  /** Unique response ID */
  id: string;
  
  /** Survey ID */
  surveyId: string;
  
  /** Respondent user ID (null if anonymous) */
  respondentId?: string;
  
  /** Respondent display name (for attribution) */
  respondentName?: string;
  
  /** When response was started */
  startedAt: string;
  
  /** When response was completed (null if in progress) */
  completedAt?: string;
  
  /** Time spent in seconds */
  durationSeconds?: number;
  
  /** Response status */
  status: 'in_progress' | 'completed' | 'abandoned';
  
  /** All answers */
  answers: AnswerDTO[];
  
  /** Device/browser info for analytics */
  userAgent?: string;
  
  /** IP address (if collected) */
  ipAddress?: string;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Survey Response Summary DTO
 * 
 * Aggregated response data for a survey.
 */
export interface SurveyResponseSummaryDTO {
  surveyId: string;
  totalResponses: number;
  completedResponses: number;
  abandonedResponses: number;
  averageDurationSeconds: number;
  completionRate: number;
  
  /** Per-question statistics */
  questionStats: QuestionStatsDTO[];
}

/**
 * Question Statistics DTO
 */
export interface QuestionStatsDTO {
  questionId: string;
  questionText: string;
  questionType: string;
  responseCount: number;
  skipCount: number;
  
  /** For choice questions: option counts */
  optionCounts?: Record<string, number>;
  
  /** For scale/rating questions */
  average?: number;
  min?: number;
  max?: number;
  distribution?: Record<number, number>;
  
  /** For text questions */
  sampleResponses?: string[];
}
