// Dependencies
import { createFeatureSelector, createSelector } from '@ngrx/store';

//import interface that defines a layout state: 
import { LayoutState } from './layout-state';

// Use helper method to create a feature selector for the layout state:
// A feature selector extracts the layout state as a slice of the global state.
// The feature selector ensures we’re working with the correct slice of the state tree.
export const getLayoutState = createFeatureSelector<LayoutState>('layout');

// Selectors are reusable functions that extract specific pieces of state data.
// They provide several benefits:
// Encapsulation: You avoid hardcoding state logic in components.
// Reusability: The same selector can be used in multiple parts of the app.
// Memoization: Selectors automatically cache their results for performance, recalculating only when the state changes.


// Later, the selectors are referenced from Components as follows:
// import { Observable } from 'rxjs';
// import { getLayoutTheme, getSidebarSize } from './layout.selectors';
//
// @Component({
//   selector: 'app-layout',
//   template: `
//         <div [class]="theme$ | async">
//             Sidebar size: {{ sidebarSize$ | async }}
//         </div>
//     `,
// })
// export class LayoutComponent {
//   theme$: Observable<string>;
//   sidebarSize$: Observable<string>;
//
//   constructor(private store: Store) {
//     this.theme$ = this.store.select(getLayoutTheme);
//     this.sidebarSize$ = this.store.select(getSidebarSize);
//   }
// }



/**
 * Develop as a const a selector to extract the layout theme from the layout state.
 */
export const getLayoutTheme = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
  // Output selector: extracts the LAYOUT property from the layout slice
    (state: LayoutState) => state.LAYOUT
);

/**
 * Develop as a const a selector to extract the layout mode from the layout state.
 */
export const getLayoutMode = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
    // Output selector: extracts the LAYOUT_MODE property from the layout slice
    (state: LayoutState) => state.LAYOUT_MODE
);

/**
 * Develop as a const a selector to extract the layout width from the layout state.
 */
export const getLayoutWith = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
    // Output selector: extracts the LAYOUT_WIDTH property from the layout slice
    (state: LayoutState) => state.LAYOUT_WIDTH
);

/**
 * Develop as a const a selector to extract the layout position from the layout state.
 */
export const getLayoutPosition = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
    // Output selector: extracts the LAYOUT_POSITION property from the layout slice
    (state: LayoutState) => state.LAYOUT_POSITION
);

/**
 * Develop as a const a selector to extract the topbar color from the layout state.
 */
export const getTopbarColor = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
    //  Output selector: extracts the TOPBAR property from the layout slice
    (state: LayoutState) => state.TOPBAR
);

/**
 * Develop as a const a selector to extract the sidebar size from the layout state.
 */
export const getSidebarSize = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
    // Output selector: extracts the SIDEBAR_SIZE property from the layout slice
    (state: LayoutState) => state.SIDEBAR_SIZE
);

/**
 * Develop as a const a selector to extract the sidebar color from the layout state.
 */
export const getSidebarColor = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
    // Output selector: extracts the SIDEBAR_COLOR property from the layout slice
    (state: LayoutState) => state.SIDEBAR_COLOR
);

/**
 * Develop as a const a selector to extract the sidebar view from the layout state.
 */
export const getSidebarView = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
    // Output selector: extracts the SIDEBAR_VIEW property from the layout slice
    (state: LayoutState) => state.SIDEBAR_VIEW
);

/**
 * Develop as a const a selector to extract the sidebar image from the layout state.
 */
export const getSidebarImage = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
    // Output selector: extracts the SIDEBAR_IMAGE property from the layout slice
    (state: LayoutState) => state.SIDEBAR_IMAGE
);

/**
 * Develop as a const a selector to extract the sidebar visibility from the layout state.
 */
export const getSidebarVisibilitye = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
    // Output selector: extracts the SIDEBAR_VISIBILITY property from the layout slice
    (state: LayoutState) => state.SIDEBAR_VISIBILITY
);

/**
 * Develop as a const a selector to extract the preloader from the layout state.
 */
export const getPreloader = createSelector(
  // Input selector: provides the layout slice
  getLayoutState,
    // Output selector: extracts the DATA_PRELOADER property from the layout slice
    (state: LayoutState) => state.DATA_PRELOADER
);
