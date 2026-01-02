/**
 * Workflow Engine Service
 * 
 * Executes workflows and manages state transitions.
 */
import { Injectable, signal, computed } from '@angular/core';
import { Workflow, WorkflowStep, WorkflowTransition } from '../models/workflow.model';
import { WorkflowState, createWorkflowState, StepHistoryEntry } from '../models/workflow-state.model';
import { ConditionEvaluatorService } from './condition-evaluator.service';

@Injectable({ providedIn: 'root' })
export class WorkflowEngineService {
  
  // Current workflow and state
  private _workflow = signal<Workflow | null>(null);
  private _state = signal<WorkflowState | null>(null);
  
  // Computed
  workflow = computed(() => this._workflow());
  state = computed(() => this._state());
  currentStep = computed(() => {
    const wf = this._workflow();
    const st = this._state();
    if (!wf || !st) return null;
    return wf.steps.find(s => s.id === st.currentStepId) || null;
  });
  isCompleted = computed(() => this._state()?.status === 'completed');
  progress = computed(() => {
    const st = this._state();
    const wf = this._workflow();
    if (!st || !wf) return 0;
    const totalSteps = wf.steps.filter(s => s.type !== 'end').length;
    const completedSteps = st.history.length;
    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  });

  constructor(private conditionEvaluator: ConditionEvaluatorService) {}

  /**
   * Start a workflow
   */
  start(workflow: Workflow): WorkflowState {
    this._workflow.set(workflow);
    const state = createWorkflowState(workflow.id, workflow.initialStepId);
    state.status = 'in_progress';
    state.history.push({
      stepId: workflow.initialStepId,
      enteredAt: new Date(),
    });
    this._state.set(state);
    return state;
  }

  /**
   * Submit data for current step and advance
   */
  submit(stepData: Record<string, unknown>): WorkflowState | null {
    const workflow = this._workflow();
    const state = this._state();
    
    if (!workflow || !state) {
      console.error('[WorkflowEngine] No active workflow');
      return null;
    }

    // Merge step data
    const newData = { ...state.data, ...stepData };
    
    // Find next step
    const nextTransition = this.findNextTransition(workflow, state.currentStepId, newData);
    
    if (!nextTransition) {
      console.warn('[WorkflowEngine] No valid transition found');
      return state;
    }

    // Update history
    const now = new Date();
    const history = [...state.history];
    const currentEntry = history.find(h => h.stepId === state.currentStepId && !h.exitedAt);
    if (currentEntry) {
      currentEntry.exitedAt = now;
      currentEntry.data = stepData;
      currentEntry.transitionId = nextTransition.id;
    }

    // Add new step to history
    history.push({
      stepId: nextTransition.to,
      enteredAt: now,
    });

    // Check if we reached an end step
    const nextStep = workflow.steps.find(s => s.id === nextTransition.to);
    const isEnd = nextStep?.type === 'end';

    // Update state
    const newState: WorkflowState = {
      ...state,
      currentStepId: nextTransition.to,
      data: newData,
      history,
      status: isEnd ? 'completed' : 'in_progress',
      updatedAt: now,
      completedAt: isEnd ? now : undefined,
    };

    this._state.set(newState);
    return newState;
  }

  /**
   * Go back to previous step
   */
  goBack(): WorkflowState | null {
    const state = this._state();
    if (!state || state.history.length <= 1) return state;

    const history = [...state.history];
    history.pop(); // Remove current step
    const previousEntry = history[history.length - 1];

    const newState: WorkflowState = {
      ...state,
      currentStepId: previousEntry.stepId,
      history,
      updatedAt: new Date(),
    };

    this._state.set(newState);
    return newState;
  }

  /**
   * Reset workflow
   */
  reset(): void {
    this._workflow.set(null);
    this._state.set(null);
  }

  /**
   * Find the next valid transition
   */
  private findNextTransition(
    workflow: Workflow,
    fromStepId: string,
    data: Record<string, unknown>
  ): WorkflowTransition | null {
    // Get all transitions from current step
    const transitions = workflow.transitions
      .filter(t => t.from === fromStepId)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Find first transition with matching condition
    for (const transition of transitions) {
      if (!transition.condition) {
        // No condition = always valid (fallback)
        return transition;
      }

      if (this.conditionEvaluator.evaluate(transition.condition, data)) {
        return transition;
      }
    }

    return null;
  }
}
