import { Action, createReducer, on } from '@ngrx/store';


import { LayoutState, initialLayoutState } from './layout-state';

// Import defined Layout Actions constants:
import {
  changeMode,
  changeLayoutWidth,
  changeLayoutPosition,
  changeTopbar,
  changeDataPreloader,
  changeSidebarColor,
  changeSidebarSize,
  changelayout,
  changeSidebarImage,
  changeSidebarView,
  changeSidebarVisibility
} from "./layout-action";


/**
 * Layout Reducer.
 * 
 * @param state LayoutState
 */
export const layoutReducer = createReducer(
    // Initial State:
  initialLayoutState,
  // Actions:

  /**
   * Changes the layout in the current state.
   * 
   * This handler listens for the `changelayout` action and updates the `LAYOUT` property
   * in the state with the new layout value provided in the action payload.
   *
   * @param state - The current state of the application.
   * @param action - The dispatched action containing the new layout value (`action.layout`).
   * @returns A new state object with the updated `LAYOUT` property.
   */
  on(changelayout, (state, action) => ({ ...state, LAYOUT: action.layout })),

  /**
   * Changes the Mode in the current state.
   * 
   * This handler listens for the `changeMode` action and updates the `LAYOUT_MODE` property
   * in the state with the new layout value provided in the action payload.
   *
   * @param state - The current state of the application.
   * @param action - The dispatched action containing the new layout value (`action.mode`).
   * @returns A new state object with the updated `LAYOUT_MODE` property.
   */
  on(changeMode, (state, action) => ({ ...state, LAYOUT_MODE: action.mode })),
  /**
   * Changes the Mode in the current state.
   * 
   * This handler listens for the `changeLayoutWidth` action and updates the `LAYOUT_WIDTH` property
   * in the state with the new layout value provided in the action payload.
   *
   * @param state - The current state of the application.
   * @param action - The dispatched action containing the new layout value (`action.layoutWidth`).
   * @returns A new state object with the updated `LAYOUT_WIDTH` property.
   */
  on(changeLayoutWidth, (state, action) => ({ ...state, LAYOUT_WIDTH: action.layoutWidth })),
  /**
   * Changes the Mode in the current state.
   * 
   * This handler listens for the `changeLayoutPosition` action and updates the `LAYOUT_POSITION` property
   * in the state with the new layout value provided in the action payload.
   *
   * @param state - The current state of the application.
   * @param action - The dispatched action containing the new layout value (`action.layoutPosition`).
   * @returns A new state object with the updated `LAYOUT_POSITION` property.
   */
  on(changeLayoutPosition, (state, action) => ({ ...state, LAYOUT_POSITION: action.layoutPosition })),
  /**
   * Changes the Mode in the current state.
   * 
   * This handler listens for the `changeTopbar` action and updates the `LAYOUT_TOPBAR_COLOR_TYPES` property
   * in the state with the new layout value provided in the action payload.
   *
   * @param state - The current state of the application.
   * @param action - The dispatched action containing the new layout value (`action.topbarColor`).
   * @returns A new state object with the updated `LAYOUT_TOPBAR_COLOR_TYPES` property.
   */
  on(changeTopbar, (state, action) => ({ ...state, TOPBAR: action.topbarColor })),
  /**
   * Changes the Mode in the current state.
   * 
   * This handler listens for the `changeSidebarImage` action and updates the `SIDEBAR_IMAGE` property
   * in the state with the new layout value provided in the action payload.
   *
   * @param state - The current state of the application.
   * @param action - The dispatched action containing the new layout value (`action.changeSidebarImage`).
   * @returns A new state object with the updated `SIDEBAR_IMAGE` property.
   */
  on(changeSidebarImage, (state, action) => ({ ...state, SIDEBAR_IMAGE: action.sidebarImage })),
    /**
     *  Change Data Preloader
     */
  on(changeDataPreloader, (state, action) => ({ ...state, DATA_PRELOADER: action.Preloader })),

  /**
   * Changes the Sidebar colour.
   * 
   * This handler listens for the `changeSidebarColor` action and updates the `SIDEBAR_COLOR` property
   * in the state with the new layout value provided in the action payload.
   *
   * @param state - The current state of the application.
   * @param action - The dispatched action containing the new layout value (`action.changeSidebarColor`).
   * @returns A new state object with the updated `SIDEBAR_COLOR` property.
   */
  on(changeSidebarColor, (state, action) => ({ ...state, SIDEBAR_COLOR: action.sidebarColor })),
  /**
   * Changes the Sidebar colour.
   * 
   * This handler listens for the `changeSidebarSize` action and updates the `SIDEBAR_SIZE` property
   * in the state with the new layout value provided in the action payload.
   *
   * @param state - The current state of the application.
   * @param action - The dispatched action containing the new layout value (`action.changeSidebarSize`).
   * @returns A new state object with the updated `SIDEBAR_SIZE` property.
   */
  on(changeSidebarSize, (state, action) => ({ ...state, SIDEBAR_SIZE: action.sidebarSize })),
  /**
   * Changes the Sidebar view.
   * 
   * This handler listens for the `changeSidebarView` action and updates the `SIDEBAR_VIEW` property
   * in the state with the new layout value provided in the action payload.
   *
   * @param state - The current state of the application.
   * @param action - The dispatched action containing the new layout value (`action.changeSidebarView`).
   * @returns A new state object with the updated `SIDEBAR_VIEW` property.
   */
  on(changeSidebarView, (state, action) => ({ ...state, SIDEBAR_VIEW: action.sidebarView })),

  /**
   * Changes the Sidebar visibility.
   * 
   * This handler listens for the `changeSidebarVisibility` action and updates the `SIDEBAR_VISIBILITY` property
   * in the state with the new layout value provided in the action payload.
   *
   * @param state - The current state of the application.
   * @param action - The dispatched action containing the new layout value (`action.changeSidebarVisibility`).
   * @returns A new state object with the updated `SIDEBAR_VISIBILITY` property.
   */
    on(changeSidebarVisibility, (state, action) => ({ ...state, SIDEBAR_VISIBILITY: action.sidebarvisibility }))
);


//
/**
 * Selector
 * 
 * @param state
 * @param action
 * @returns
 */
export function reducer(state: LayoutState | undefined, action: Action) {
    return layoutReducer(state, action);
}
