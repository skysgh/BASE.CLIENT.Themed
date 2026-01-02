/**
 * Survey Question ViewModel
 * 
 * UI format for survey questions with computed properties.
 */
import { QuestionType, QUESTION_TYPE_LABELS, QUESTION_TYPE_ICONS } from '../constants';
import { DisplayConditionViewModel } from './display-condition.model';

/**
 * Question Option ViewModel
 */
export interface QuestionOptionViewModel {
  id: string;
  text: string;
  value: string;
  order: number;
  icon?: string;
  color?: string;
  isSelected?: boolean;  // Current selection state
}

/**
 * Survey Question ViewModel (UI format)
 */
export interface SurveyQuestionViewModel {
  id: string;
  groupId: string;
  type: QuestionType;
  typeLabel: string;
  typeIcon: string;
  text: string;
  helpText?: string;
  required: boolean;
  order: number;
  
  // Choice options
  options: QuestionOptionViewModel[];
  allowOther: boolean;
  randomizeOptions: boolean;
  
  // Scale options
  scaleMin: number;
  scaleMax: number;
  scaleLabels: Record<number, string>;
  scaleStep: number;
  scaleValues: number[];  // Computed: array of scale values for iteration
  
  // Rating options
  ratingStyle: 'stars' | 'hearts' | 'thumbs' | 'emoji';
  ratingMax: number;
  ratingValues: number[];  // Computed: array for iteration
  
  // Text options
  textType: 'short' | 'long' | 'email' | 'number';
  placeholder?: string;
  
  // Matrix options
  matrixRows: { id: string; text: string }[];
  matrixColumns: { id: string; text: string }[];
  
  // Validation
  validation: {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    minSelections?: number;
    maxSelections?: number;
    pattern?: string;
    patternMessage?: string;
  };
  
  // Display conditions
  displayConditions: DisplayConditionViewModel[];
  displayLogic: 'and' | 'or';
  hasConditions: boolean;  // Computed: quick check
  
  // Current answer (for form binding)
  currentAnswer?: string | string[] | number | Record<string, string>;
  isAnswered: boolean;
  isValid: boolean;
  validationErrors: string[];
}
