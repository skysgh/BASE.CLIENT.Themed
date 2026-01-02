/**
 * Batch Action Model
 * 
 * Defines actions that can be applied to selected items in a browse view.
 * These are different from card actions (which apply to a single card).
 */

/**
 * A batch action that can be applied to selected items
 */
export interface BatchAction {
  /** Unique identifier */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Icon class */
  icon: string;
  
  /** Button variant (primary, secondary, danger, etc.) */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Is this action always visible (even with 0 selected)? */
  alwaysVisible?: boolean;
  
  /** Minimum number of selected items required */
  minSelection?: number;
  
  /** Maximum number of selected items allowed (0 = unlimited) */
  maxSelection?: number;
  
  /** Requires confirmation before executing */
  requiresConfirmation?: boolean;
  
  /** Confirmation message template (use {count} for selection count) */
  confirmationMessage?: string;
  
  /** Is action currently disabled? */
  disabled?: boolean;
  
  /** Tooltip when disabled */
  disabledReason?: string;
}

/**
 * Event emitted when a batch action is triggered
 */
export interface BatchActionEvent {
  /** The action that was triggered */
  action: BatchAction;
  
  /** IDs of selected items */
  selectedIds: string[];
}

/**
 * Create an Add action (always visible)
 */
export function createAddAction(
  label: string = 'Add',
  icon: string = 'bx bx-plus'
): BatchAction {
  return {
    id: 'add',
    label,
    icon,
    variant: 'primary',
    alwaysVisible: true,
    minSelection: 0,
    maxSelection: 0,
  };
}

/**
 * Create a batch action
 */
export function createBatchAction(
  id: string,
  label: string,
  options: Partial<BatchAction> = {}
): BatchAction {
  return {
    id,
    label,
    icon: options.icon || 'bx bx-check',
    variant: options.variant || 'secondary',
    minSelection: options.minSelection ?? 1,
    maxSelection: options.maxSelection ?? 0,
    ...options,
  };
}

/**
 * Create a delete batch action
 */
export function createDeleteBatchAction(
  label: string = 'Delete'
): BatchAction {
  return {
    id: 'delete',
    label,
    icon: 'bx bx-trash',
    variant: 'danger',
    minSelection: 1,
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete {count} item(s)?',
  };
}
