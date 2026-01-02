/**
 * Selection Model
 * 
 * Manages multi-select state for BrowseView with support for:
 * - Click: Select single item (then navigate)
 * - Ctrl+Click: Toggle item in selection
 * - Shift+Click: Range select
 * - Long press (mobile): Toggle selection
 */

/**
 * Selection state
 */
export interface SelectionState {
  /** Currently selected item IDs */
  selectedIds: Set<string>;
  /** Last clicked item ID (for range select) */
  lastClickedId: string | null;
  /** Selection mode active */
  isSelecting: boolean;
}

/**
 * Create initial selection state
 */
export function createSelectionState(): SelectionState {
  return {
    selectedIds: new Set(),
    lastClickedId: null,
    isSelecting: false,
  };
}

/**
 * Selection event from card/row click
 */
export interface SelectionEvent {
  id: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  isLongPress?: boolean;
}

/**
 * Handle selection logic
 * Returns new selected IDs and whether to navigate
 */
export function handleSelection(
  state: SelectionState,
  event: SelectionEvent,
  allIds: string[]
): { selectedIds: Set<string>; shouldNavigate: boolean; lastClickedId: string } {
  const { id, ctrlKey, shiftKey, isLongPress } = event;
  const newSelected = new Set(state.selectedIds);
  
  // Long press or Ctrl+Click: Toggle selection
  if (isLongPress || ctrlKey) {
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    return {
      selectedIds: newSelected,
      shouldNavigate: false,
      lastClickedId: id,
    };
  }
  
  // Shift+Click: Range select
  if (shiftKey && state.lastClickedId) {
    const lastIndex = allIds.indexOf(state.lastClickedId);
    const currentIndex = allIds.indexOf(id);
    
    if (lastIndex !== -1 && currentIndex !== -1) {
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      
      for (let i = start; i <= end; i++) {
        newSelected.add(allIds[i]);
      }
      
      return {
        selectedIds: newSelected,
        shouldNavigate: false,
        lastClickedId: id,
      };
    }
  }
  
  // Regular click: If items already selected, just add to selection
  // If nothing selected, navigate immediately
  if (state.selectedIds.size > 0) {
    // Already in selection mode - toggle this item
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    return {
      selectedIds: newSelected,
      shouldNavigate: false,
      lastClickedId: id,
    };
  }
  
  // Nothing selected - single click navigates
  return {
    selectedIds: new Set([id]),
    shouldNavigate: true,
    lastClickedId: id,
  };
}

/**
 * Clear selection
 */
export function clearSelection(): SelectionState {
  return createSelectionState();
}

/**
 * Select all
 */
export function selectAll(allIds: string[]): Set<string> {
  return new Set(allIds);
}

/**
 * Invert selection
 */
export function invertSelection(currentSelected: Set<string>, allIds: string[]): Set<string> {
  const inverted = new Set<string>();
  for (const id of allIds) {
    if (!currentSelected.has(id)) {
      inverted.add(id);
    }
  }
  return inverted;
}
