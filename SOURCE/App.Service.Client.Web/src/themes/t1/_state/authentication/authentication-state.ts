// Models (used as argument in some actions and as part of the state):
import { User } from './auth.models';

/**
 * Defines the structure of the state of authentication.
 */
export interface AuthenticationState {
  /**
   * Whether the user is currently logged in.
   */
  isLoggedIn: boolean;
  /**
   *  The logged-in user object (or null if no one is logged in).
   */
  user: User | null;
  /**
   * The error message to display to the user (or null if there is no error).
   */
  error: string | null;
}

/**
 * Defines a const of initial state of the authentication state
 * implementing AuthenticationState and setting its values.
 */
export const initialAuthenticationState: AuthenticationState = {
  isLoggedIn: false,
  user: null,
  error: null,
};

