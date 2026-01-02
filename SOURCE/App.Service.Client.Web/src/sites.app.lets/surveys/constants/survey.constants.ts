/**
 * Survey Constants
 */

// ─────────────────────────────────────────────────────────────
// Question Types
// ─────────────────────────────────────────────────────────────

export type QuestionType = 
  | 'single'      // Single choice (radio)
  | 'multiple'    // Multiple choice (checkbox)
  | 'scale'       // Numeric scale (1-5, 1-10, NPS)
  | 'text'        // Text input (short or long)
  | 'rating'      // Stars, emoji
  | 'matrix'      // Grid of questions
  | 'ranking';    // Drag to order

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single: 'Single Choice',
  multiple: 'Multiple Choice',
  scale: 'Scale',
  text: 'Text',
  rating: 'Rating',
  matrix: 'Matrix',
  ranking: 'Ranking',
};

export const QUESTION_TYPE_ICONS: Record<QuestionType, string> = {
  single: 'bx-radio-circle-marked',
  multiple: 'bx-checkbox-checked',
  scale: 'bx-slider',
  text: 'bx-text',
  rating: 'bx-star',
  matrix: 'bx-grid-alt',
  ranking: 'bx-sort-alt-2',
};

// ─────────────────────────────────────────────────────────────
// Survey Types
// ─────────────────────────────────────────────────────────────

export type SurveyType = 
  | 'feedback'    // General feedback, NPS
  | 'onboarding'  // New user setup
  | 'research'    // User research, market research
  | 'compliance'; // Required acknowledgments

export const SURVEY_TYPE_LABELS: Record<SurveyType, string> = {
  feedback: 'Feedback',
  onboarding: 'Onboarding',
  research: 'Research',
  compliance: 'Compliance',
};

// ─────────────────────────────────────────────────────────────
// Survey Status
// ─────────────────────────────────────────────────────────────

export type SurveyStatus = 
  | 'draft'     // Not published
  | 'active'    // Accepting responses
  | 'closed'    // No longer accepting
  | 'archived'; // Hidden

export const SURVEY_STATUS_LABELS: Record<SurveyStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  closed: 'Closed',
  archived: 'Archived',
};

export const SURVEY_STATUS_COLORS: Record<SurveyStatus, string> = {
  draft: 'secondary',
  active: 'success',
  closed: 'warning',
  archived: 'dark',
};

// ─────────────────────────────────────────────────────────────
// Display Condition Operators
// ─────────────────────────────────────────────────────────────

export type ConditionOperator = 
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn'
  | 'answered'
  | 'notAnswered';

export const CONDITION_OPERATOR_LABELS: Record<ConditionOperator, string> = {
  equals: 'Equals',
  notEquals: 'Does not equal',
  contains: 'Contains',
  notContains: 'Does not contain',
  greaterThan: 'Greater than',
  lessThan: 'Less than',
  greaterThanOrEqual: 'Greater than or equal',
  lessThanOrEqual: 'Less than or equal',
  in: 'Is one of',
  notIn: 'Is not one of',
  answered: 'Was answered',
  notAnswered: 'Was not answered',
};

// ─────────────────────────────────────────────────────────────
// Predefined Scales
// ─────────────────────────────────────────────────────────────

export const SCALE_PRESETS = {
  satisfaction5: {
    min: 1,
    max: 5,
    labels: {
      1: 'Very Dissatisfied',
      2: 'Dissatisfied',
      3: 'Neutral',
      4: 'Satisfied',
      5: 'Very Satisfied',
    },
  },
  agreement5: {
    min: 1,
    max: 5,
    labels: {
      1: 'Strongly Disagree',
      2: 'Disagree',
      3: 'Neutral',
      4: 'Agree',
      5: 'Strongly Agree',
    },
  },
  nps: {
    min: 0,
    max: 10,
    labels: {
      0: 'Not at all likely',
      10: 'Extremely likely',
    },
  },
  likelihood5: {
    min: 1,
    max: 5,
    labels: {
      1: 'Very Unlikely',
      2: 'Unlikely',
      3: 'Neutral',
      4: 'Likely',
      5: 'Very Likely',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────

export const SURVEY_ROUTES = {
  hub: '/system/surveys',
  take: '/system/surveys/take',
  results: '/system/surveys/results',
  admin: '/system/surveys/admin',
  edit: '/system/surveys/admin/edit',
};
