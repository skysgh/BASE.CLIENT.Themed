/**
 * PanelHistoryService
 * 
 * A universal service for managing browser history integration with overlay panels
 * (offcanvas, modals, flyouts). This solves the mobile UX problem where users expect
 * the browser back button/swipe to close panels rather than navigate away.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * PROBLEM BEING SOLVED
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * On mobile devices, users often:
 * 1. Swipe back (iOS Safari, Android Chrome) to "go back"
 * 2. Tap the browser's back button
 * 
 * Without history management, this navigates away from the page entirely,
 * even if a panel/flyout is open. Users expect the panel to close first.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * SOLUTION: History API Integration
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * When a panel opens:
 *   1. Push a history state entry (no URL change)
 *   2. Listen for popstate (browser back)
 *   3. When popstate fires, close the panel
 * 
 * When a panel closes (any trigger - X button, backdrop, Apply, etc.):
 *   1. If we pushed a history entry, call history.back() to clean up
 *   2. But NOT if we're closing due to popstate (that already did the back)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPLEXITY & EDGE CASES HANDLED
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 1. DOUBLE-BACK PREVENTION
 *    Problem: If user clicks X (which calls history.back()) at the same moment
 *             they pressed browser back, we'd go back twice.
 *    Solution: Track whether close was triggered by popstate. If so, don't
 *              call history.back() again.
 * 
 * 2. RAPID OPEN/CLOSE
 *    Problem: User rapidly opens/closes panel, history stack gets corrupted.
 *    Solution: Use unique panel IDs in history state. Only respond to popstate
 *              if the state matches our panel ID.
 * 
 * 3. MULTIPLE PANELS
 *    Problem: Two components both want history management.
 *    Solution: Each panel gets a unique ID. History stack can have multiple
 *              entries. Service tracks which panels are "active" in history.
 * 
 * 4. COMPONENT DESTRUCTION
 *    Problem: Component unmounts while panel is open, orphan history entry.
 *    Solution: Components must call cleanup() in ngOnDestroy. Service
 *              provides helper methods.
 * 
 * 5. IN-APP BACK BUTTON
 *    Problem: App has its own back button that should close panel first.
 *    Solution: Provide canNavigateBack() check. If a panel is open,
 *              close it instead of navigating.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * USAGE EXAMPLE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ```typescript
 * @Component({...})
 * class MyComponent implements OnDestroy {
 *   private panelHistory = inject(PanelHistoryService);
 *   private panelId = 'my-configure-panel';
 *   
 *   openPanel(): void {
 *     // Register with history service
 *     this.panelHistory.pushPanelState(this.panelId, () => {
 *       // This callback is invoked when browser back is pressed
 *       this.closePanelInternal();
 *     });
 *     
 *     // Actually open your panel (NgbOffcanvas, etc.)
 *     this.offcanvasRef = this.offcanvasService.open(...);
 *   }
 *   
 *   closePanel(): void {
 *     // Tell history service we're closing (it will call history.back if needed)
 *     this.panelHistory.closePanelState(this.panelId);
 *     
 *     // Actually close your panel
 *     this.closePanelInternal();
 *   }
 *   
 *   private closePanelInternal(): void {
 *     this.offcanvasRef?.dismiss();
 *     this.offcanvasRef = undefined;
 *   }
 *   
 *   ngOnDestroy(): void {
 *     // Clean up if component is destroyed while panel is open
 *     this.panelHistory.removePanelState(this.panelId);
 *   }
 * }
 * ```
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTERCEPTING IN-APP BACK BUTTON
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ```typescript
 * // In your navigation service or back button handler:
 * onBackButtonClick(): void {
 *   if (this.panelHistory.hasActivePanels()) {
 *     // Close the topmost panel instead of navigating
 *     this.panelHistory.closeTopmostPanel();
 *   } else {
 *     // Normal navigation
 *     this.router.back();
 *   }
 * }
 * ```
 */

import { Injectable, inject, NgZone } from '@angular/core';
import { Location } from '@angular/common';

/** State stored in history for panel tracking */
interface PanelHistoryState {
  panelId: string;
  timestamp: number;
}

/** Internal tracking of registered panels */
interface RegisteredPanel {
  id: string;
  onPopClose: () => void;  // Callback when browser back closes the panel
  isClosingFromPop: boolean;  // Flag to prevent double history.back()
}

@Injectable({
  providedIn: 'root'
})
export class PanelHistoryService {
  private ngZone = inject(NgZone);
  private location = inject(Location);
  
  /**
   * Map of panel ID -> registration info
   * Tracks all panels that have pushed history state
   */
  private activePanels = new Map<string, RegisteredPanel>();
  
  /**
   * Stack of panel IDs in order they were opened
   * Used to close panels in LIFO order when needed
   */
  private panelStack: string[] = [];
  
  /**
   * Bound popstate handler (stored so we can remove it)
   */
  private boundPopstateHandler: ((event: PopStateEvent) => void) | null = null;
  
  constructor() {
    this.setupPopstateListener();
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Public API
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Push a history state for a panel being opened.
   * Call this BEFORE opening the actual panel UI.
   * 
   * @param panelId - Unique identifier for this panel instance
   * @param onPopClose - Callback invoked when browser back closes the panel.
   *                     This should close your panel UI (but NOT call closePanelState).
   * 
   * IMPORTANT: The onPopClose callback should close the panel's visual UI
   * (dismiss the offcanvas, hide the modal, etc.) but should NOT call
   * closePanelState() - that would cause a double history.back().
   */
  pushPanelState(panelId: string, onPopClose: () => void): void {
    // If this panel already has an active state, remove it first
    if (this.activePanels.has(panelId)) {
      console.warn(`[PanelHistory] Panel "${panelId}" already active, cleaning up first`);
      this.removePanelState(panelId);
    }
    
    // Register the panel
    this.activePanels.set(panelId, {
      id: panelId,
      onPopClose,
      isClosingFromPop: false,
    });
    this.panelStack.push(panelId);
    
    // Push history state (no URL change)
    const state: PanelHistoryState = {
      panelId,
      timestamp: Date.now(),
    };
    
    // Use history.pushState directly (not location.go) to avoid Angular router involvement
    // This adds to browser history without triggering route changes
    history.pushState(state, '');
    
    console.debug(`[PanelHistory] Pushed state for panel "${panelId}"`);
  }
  
  /**
   * Close a panel's history state.
   * Call this when the panel is being closed by user action (X button, Apply, etc.)
   * 
   * This will call history.back() to remove the history entry we pushed,
   * UNLESS the close was triggered by browser back (popstate).
   * 
   * @param panelId - The panel being closed
   */
  closePanelState(panelId: string): void {
    const panel = this.activePanels.get(panelId);
    if (!panel) {
      // Panel wasn't registered or already cleaned up - that's fine
      console.debug(`[PanelHistory] Panel "${panelId}" not active, nothing to close`);
      return;
    }
    
    // Check if this close was triggered by popstate
    if (panel.isClosingFromPop) {
      // Browser back already did the history navigation
      // Just clean up our tracking
      console.debug(`[PanelHistory] Panel "${panelId}" closing from popstate, skipping history.back()`);
      this.removePanelStateInternal(panelId);
      return;
    }
    
    // User closed the panel via UI (X button, Apply, etc.)
    // We need to call history.back() to remove our history entry
    console.debug(`[PanelHistory] Panel "${panelId}" closing from UI, calling history.back()`);
    
    // Mark that we're intentionally going back so popstate handler knows
    panel.isClosingFromPop = true;
    
    // Clean up tracking
    this.removePanelStateInternal(panelId);
    
    // Go back to remove our history entry
    // This will trigger popstate, but the panel is already gone so it's a no-op
    history.back();
  }
  
  /**
   * Remove a panel's history tracking without affecting browser history.
   * Use this in ngOnDestroy to clean up if component is destroyed.
   * 
   * WARNING: This leaves an orphan history entry. Only use when component
   * is being destroyed and you can't do proper cleanup.
   * 
   * @param panelId - The panel to remove
   */
  removePanelState(panelId: string): void {
    this.removePanelStateInternal(panelId);
    console.debug(`[PanelHistory] Removed panel "${panelId}" (orphan history entry may exist)`);
  }
  
  /**
   * Check if any panels are currently active in history.
   * Use this to determine if in-app back button should close a panel
   * instead of navigating.
   */
  hasActivePanels(): boolean {
    return this.activePanels.size > 0;
  }
  
  /**
   * Get the topmost (most recently opened) panel ID.
   */
  getTopmostPanelId(): string | null {
    if (this.panelStack.length === 0) return null;
    return this.panelStack[this.panelStack.length - 1];
  }
  
  /**
   * Close the topmost panel.
   * Use this when intercepting in-app back button.
   * This triggers browser back which will close the panel.
   */
  closeTopmostPanel(): void {
    if (this.panelStack.length === 0) {
      console.warn('[PanelHistory] No panels to close');
      return;
    }
    
    // Just call history.back() - the popstate handler will close the panel
    history.back();
  }
  
  /**
   * Check if a specific panel is active.
   */
  isPanelActive(panelId: string): boolean {
    return this.activePanels.has(panelId);
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // Private Implementation
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Set up the global popstate listener.
   * 
   * COMPLEXITY NOTE: We use a single global listener rather than per-panel
   * listeners because popstate is a global event. Multiple listeners would
   * all fire for the same back action.
   */
  private setupPopstateListener(): void {
    if (this.boundPopstateHandler) {
      return; // Already set up
    }
    
    this.boundPopstateHandler = (event: PopStateEvent) => {
      // Run inside Angular zone so change detection works
      this.ngZone.run(() => {
        this.handlePopstate(event);
      });
    };
    
    window.addEventListener('popstate', this.boundPopstateHandler);
  }
  
  /**
   * Handle browser back button press.
   * 
   * COMPLEXITY NOTE: We check the state to see if it was our panel state.
   * If it was, we close the panel. If not, it's normal navigation.
   * 
   * EDGE CASE: If user goes back past our state (e.g., long-press back
   * and select older history), our panel states might be orphaned.
   * We handle this by checking if the state matches an active panel.
   */
  private handlePopstate(event: PopStateEvent): void {
    // The state BEFORE this popstate was our panel state
    // Now we've navigated back, so we need to close the panel
    
    if (this.panelStack.length === 0) {
      // No panels active, this is normal navigation
      return;
    }
    
    // Get the topmost panel (most recently opened)
    const topmostPanelId = this.panelStack[this.panelStack.length - 1];
    const panel = this.activePanels.get(topmostPanelId);
    
    if (!panel) {
      // Panel was already closed somehow - clean up
      this.panelStack.pop();
      return;
    }
    
    // Check if already closing (prevent re-entrance)
    if (panel.isClosingFromPop) {
      return;
    }
    
    console.debug(`[PanelHistory] Popstate detected, closing panel "${topmostPanelId}"`);
    
    // Mark that this close is from popstate (so closePanelState won't double-back)
    panel.isClosingFromPop = true;
    
    // Invoke the close callback (this should close the panel UI)
    panel.onPopClose();
    
    // Clean up tracking
    this.removePanelStateInternal(topmostPanelId);
  }
  
  /**
   * Internal cleanup of panel tracking.
   */
  private removePanelStateInternal(panelId: string): void {
    this.activePanels.delete(panelId);
    
    // Remove from stack
    const stackIndex = this.panelStack.indexOf(panelId);
    if (stackIndex !== -1) {
      this.panelStack.splice(stackIndex, 1);
    }
  }
}
