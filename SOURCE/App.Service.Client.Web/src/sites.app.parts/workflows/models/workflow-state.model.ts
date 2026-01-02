/**
 * Workflow State Model
 * 
 * Runtime state of a workflow execution.
 */

/** Workflow execution state */
export interface WorkflowState {
  workflowId: string;
  instanceId: string;
  currentStepId: string;
  status: WorkflowStatus;
  data: Record<string, unknown>;
  history: StepHistoryEntry[];
  startedAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

/** Workflow execution status */
export type WorkflowStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'waiting' 
  | 'completed' 
  | 'cancelled' 
  | 'error';

/** Step history entry */
export interface StepHistoryEntry {
  stepId: string;
  enteredAt: Date;
  exitedAt?: Date;
  data?: Record<string, unknown>;
  transitionId?: string;
}

/** Create initial workflow state */
export function createWorkflowState(
  workflowId: string,
  initialStepId: string
): WorkflowState {
  const now = new Date();
  return {
    workflowId,
    instanceId: generateInstanceId(),
    currentStepId: initialStepId,
    status: 'pending',
    data: {},
    history: [],
    startedAt: now,
    updatedAt: now,
  };
}

function generateInstanceId(): string {
  return `wf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
