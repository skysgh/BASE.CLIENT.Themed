/**
 * Workflow Model
 * 
 * Defines a workflow as a directed graph of steps.
 */

/** Workflow definition */
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  steps: WorkflowStep[];
  transitions: WorkflowTransition[];
  initialStepId: string;
  metadata?: Record<string, unknown>;
}

/** Step in a workflow */
export interface WorkflowStep {
  id: string;
  type: StepType;
  name?: string;
  description?: string;
  data?: Record<string, unknown>;
  validations?: StepValidation[];
}

/** Step types */
export type StepType = 'form' | 'decision' | 'action' | 'wait' | 'end';

/** Step validation rule */
export interface StepValidation {
  field: string;
  rule: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: unknown;
  message?: string;
}

/** Transition between steps */
export interface WorkflowTransition {
  id?: string;
  from: string;
  to: string;
  condition?: TransitionCondition;
  priority?: number;
}

/** Condition for a transition */
export interface TransitionCondition {
  field: string;
  operator: ConditionOperator;
  value: unknown;
  logic?: 'and' | 'or';
  conditions?: TransitionCondition[];
}

/** Condition operators */
export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'gt' 
  | 'gte' 
  | 'lt' 
  | 'lte' 
  | 'contains' 
  | 'not_contains'
  | 'in'
  | 'not_in'
  | 'exists'
  | 'not_exists';
