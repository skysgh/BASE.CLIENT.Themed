/**
 * Survey Question DTO
 * 
 * Wire format for survey questions.
 */
import { QuestionType } from '../constants';
import { DisplayConditionDTO } from './display-condition.model';

/**
 * Question Option DTO
 */
export interface QuestionOptionDTO {
  id: string;
  text: string;
  value: string;
  order: number;
  icon?: string;
  color?: string;
}

/**
 * Question Validation DTO
 */
export interface QuestionValidationDTO {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  minSelections?: number;
  maxSelections?: number;
  pattern?: string;
  patternMessage?: string;
}

/**
 * Survey Question DTO (wire format)
 */
export interface SurveyQuestionDTO {
  /** Unique ID */
  id: string;
  
  /** Parent group ID */
  groupId: string;
  
  /** Question type */
  type: QuestionType;
  
  /** Question text */
  text: string;
  
  /** Helper text shown below question */
  helpText?: string;
  
  /** Is answer required? */
  required: boolean;
  
  /** Display order within group */
  order: number;
  
  // ─────────────────────────────────────────────────────────────
  // Choice Question Options
  // ─────────────────────────────────────────────────────────────
  
  /** Options for single/multiple choice questions */
  options?: QuestionOptionDTO[];
  
  /** Allow "Other" option with text input */
  allowOther?: boolean;
  
  /** Randomize option order */
  randomizeOptions?: boolean;
  
  // ─────────────────────────────────────────────────────────────
  // Scale Question Options
  // ─────────────────────────────────────────────────────────────
  
  /** Minimum scale value */
  scaleMin?: number;
  
  /** Maximum scale value */
  scaleMax?: number;
  
  /** Labels for specific scale values */
  scaleLabels?: Record<number, string>;
  
  /** Scale step (default 1) */
  scaleStep?: number;
  
  // ─────────────────────────────────────────────────────────────
  // Rating Question Options
  // ─────────────────────────────────────────────────────────────
  
  /** Rating style */
  ratingStyle?: 'stars' | 'hearts' | 'thumbs' | 'emoji';
  
  /** Max rating value */
  ratingMax?: number;
  
  // ─────────────────────────────────────────────────────────────
  // Text Question Options
  // ─────────────────────────────────────────────────────────────
  
  /** Text input type */
  textType?: 'short' | 'long' | 'email' | 'number';
  
  /** Placeholder text */
  placeholder?: string;
  
  // ─────────────────────────────────────────────────────────────
  // Matrix Question Options
  // ─────────────────────────────────────────────────────────────
  
  /** Matrix rows (sub-questions) */
  matrixRows?: { id: string; text: string }[];
  
  /** Matrix columns (options) */
  matrixColumns?: { id: string; text: string }[];
  
  // ─────────────────────────────────────────────────────────────
  // Validation & Conditions
  // ─────────────────────────────────────────────────────────────
  
  /** Validation rules */
  validation?: QuestionValidationDTO;
  
  /** Question-level display conditions */
  displayConditions?: DisplayConditionDTO[];
  
  /** How to combine conditions (default: 'and') */
  displayLogic?: 'and' | 'or';
}
