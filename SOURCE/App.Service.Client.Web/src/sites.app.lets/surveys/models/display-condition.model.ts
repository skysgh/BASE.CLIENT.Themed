/**
 * Display Condition Model
 * 
 * Defines when a question group or question should be shown
 * based on previous answers.
 */
import { ConditionOperator } from '../constants';

/**
 * Display Condition DTO (wire format)
 */
export interface DisplayConditionDTO {
  /** ID of the question whose answer to check */
  sourceQuestionId: string;
  
  /** Comparison operator */
  operator: ConditionOperator;
  
  /** Value to compare against (not needed for 'answered'/'notAnswered') */
  value?: string | number | string[];
}

/**
 * Display Condition ViewModel (UI format)
 */
export interface DisplayConditionViewModel {
  sourceQuestionId: string;
  sourceQuestionText?: string;  // For display in UI
  operator: ConditionOperator;
  operatorLabel: string;
  value?: string | number | string[];
  valueLabel?: string;  // Human-readable value
}
