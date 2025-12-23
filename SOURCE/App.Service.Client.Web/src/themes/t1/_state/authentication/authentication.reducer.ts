// Dependencies:
// createReducer: A utility function from NgRx to define how the state changes in response to actions.
// on: A helper function to map specific actions to their corresponding state change logic.
import { createReducer, on } from '@ngrx/store';

import { AuthenticationState, initialAuthenticationState } from './authentication-state';

// Import defined Actions from related actions file:
// Actions are events that describe what is happening in the app (e.g., a user tries to log in).
import {
  Register,
  RegisterFailure,
  RegisterSuccess,
  login,
  loginFailure,
  loginSuccess,
  logout
} from './authentication.actions';


/**
 * The reducer is a function that updates the state based on the dispatched action.
 *
 */
export const authenticationReducer =
  // It uses createReducer to map actions to state changes.
  createReducer(
    // The first argument is the initial state.
  initialAuthenticationState,
    // Each on statement specifies how the state should change in response to a particular action.
     // for example,
     // when the Register action is dispatched, the state is updated to set the error to null.
     on(Register, (state) => ({ ...state, error: null })),
    // when the RegisterSuccess action is dispatched, the state is updated to set the user to the user from the action.
     on(RegisterSuccess, (state, { user }) => ({ ...state, isLoggedIn: true, user, error: null, })),
    // when the RegisterFailure action is dispatched, the state is updated to set the error to the error from the action.
    on(RegisterFailure, (state, { error }) => ({ ...state, error })),

    // The same logic is applied to the login, loginSuccess, loginFailure, and logout actions.
    // when the login action is dispatched, the state is updated to set the error to null.
     on(login, (state) => ({ ...state, error: null })),
    // when the loginSuccess action is dispatched, the state is updated to set the user to the user from the action.
     on(loginSuccess, (state, { user }) => ({ ...state, isLoggedIn: true, user, error: null, })),
    // when the loginFailure action is dispatched, the state is updated to set the error to the error from the action.
     on(loginFailure, (state, { error }) => ({ ...state, error })),
    // when the logout action is dispatched, the state is updated to set the user to null.
    on(logout, (state) => ({ ...state, user: null })),

);
