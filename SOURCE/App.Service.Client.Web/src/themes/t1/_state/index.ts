import { ActionReducerMap } from "@ngrx/store";

import { LayoutState} from "./layout/layout-state";
import { layoutReducer } from "./layout/layout-reducer";

// import { authenticationReducer, AuthenticationState } from "./Authentication/authentication.reducer";

/**
 * An interface that describes the structure of your app's global state.
 * Each property represents a "slice" of the state.
 */
export interface RootReducerState {
  // Define LayoutState as a slice of the overall state.
  layout: LayoutState;

  // Define AuthenticationState as a slice of the overall state.
  // authentication: AuthenticationState;
}

/**
 * Define InitialState based on the structure of the RootReducerState.
 */
export const initialRootReducerState: ActionReducerMap<RootReducerState> = {
  // Define LayoutState as a slice of the overall state.
  layout: layoutReducer,

  // Define AuthenticationState as a slice of the overall state.
  // authentication: authenticationReducer,
}
