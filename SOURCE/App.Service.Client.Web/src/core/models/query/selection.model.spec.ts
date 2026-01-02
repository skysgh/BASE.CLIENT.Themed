/**
 * Selection Model Tests
 * 
 * Tests for the selection logic used in BrowseView.
 */
import { 
  SelectionState, 
  SelectionEvent, 
  createSelectionState, 
  handleSelection 
} from './selection.model';

describe('Selection Model', () => {
  const allIds = ['a', 'b', 'c', 'd', 'e'];
  
  describe('createSelectionState', () => {
    it('should create empty selection state', () => {
      const state = createSelectionState();
      
      expect(state.selectedIds.size).toBe(0);
      expect(state.lastClickedId).toBeNull();
    });
  });
  
  describe('handleSelection', () => {
    let initialState: SelectionState;
    
    beforeEach(() => {
      initialState = createSelectionState();
    });
    
    describe('simple click (no modifiers)', () => {
      it('should navigate on simple click', () => {
        const event: SelectionEvent = { 
          id: 'a', 
          ctrlKey: false, 
          shiftKey: false 
        };
        
        const result = handleSelection(initialState, event, allIds);
        
        expect(result.shouldNavigate).toBe(true);
        expect(result.selectedIds.size).toBe(0);
      });
    });
    
    describe('Ctrl+click', () => {
      it('should select item on Ctrl+click', () => {
        const event: SelectionEvent = { 
          id: 'a', 
          ctrlKey: true, 
          shiftKey: false 
        };
        
        const result = handleSelection(initialState, event, allIds);
        
        expect(result.shouldNavigate).toBe(false);
        expect(result.selectedIds.has('a')).toBe(true);
        expect(result.selectedIds.size).toBe(1);
      });
      
      it('should toggle selection on Ctrl+click already selected', () => {
        // First select 'a'
        const firstState: SelectionState = { 
          selectedIds: new Set(['a']), 
          lastClickedId: 'a',
          isSelecting: true
        };
        
        const event: SelectionEvent = { 
          id: 'a', 
          ctrlKey: true, 
          shiftKey: false 
        };
        
        const result = handleSelection(firstState, event, allIds);
        
        expect(result.selectedIds.has('a')).toBe(false);
        expect(result.selectedIds.size).toBe(0);
      });
      
      it('should add to selection on Ctrl+click different item', () => {
        const firstState: SelectionState = { 
          selectedIds: new Set(['a']), 
          lastClickedId: 'a',
          isSelecting: true
        };
        
        const event: SelectionEvent = { 
          id: 'b', 
          ctrlKey: true, 
          shiftKey: false 
        };
        
        const result = handleSelection(firstState, event, allIds);
        
        expect(result.selectedIds.has('a')).toBe(true);
        expect(result.selectedIds.has('b')).toBe(true);
        expect(result.selectedIds.size).toBe(2);
      });
    });
    
    describe('Shift+click', () => {
      it('should select range on Shift+click', () => {
        // Start with 'b' selected
        const firstState: SelectionState = { 
          selectedIds: new Set(['b']), 
          lastClickedId: 'b',
          isSelecting: true
        };
        
        const event: SelectionEvent = { 
          id: 'd', 
          ctrlKey: false, 
          shiftKey: true 
        };
        
        const result = handleSelection(firstState, event, allIds);
        
        // Should select b, c, d
        expect(result.selectedIds.has('b')).toBe(true);
        expect(result.selectedIds.has('c')).toBe(true);
        expect(result.selectedIds.has('d')).toBe(true);
        expect(result.selectedIds.size).toBe(3);
      });
      
      it('should select range backwards on Shift+click', () => {
        const firstState: SelectionState = { 
          selectedIds: new Set(['d']), 
          lastClickedId: 'd',
          isSelecting: true
        };
        
        const event: SelectionEvent = { 
          id: 'b', 
          ctrlKey: false, 
          shiftKey: true 
        };
        
        const result = handleSelection(firstState, event, allIds);
        
        expect(result.selectedIds.has('b')).toBe(true);
        expect(result.selectedIds.has('c')).toBe(true);
        expect(result.selectedIds.has('d')).toBe(true);
        expect(result.selectedIds.size).toBe(3);
      });
    });
    
    describe('long press (mobile)', () => {
      it('should select on long press', () => {
        const event: SelectionEvent = { 
          id: 'a', 
          ctrlKey: false, 
          shiftKey: false,
          isLongPress: true
        };
        
        const result = handleSelection(initialState, event, allIds);
        
        expect(result.shouldNavigate).toBe(false);
        expect(result.selectedIds.has('a')).toBe(true);
      });
    });
  });
});
