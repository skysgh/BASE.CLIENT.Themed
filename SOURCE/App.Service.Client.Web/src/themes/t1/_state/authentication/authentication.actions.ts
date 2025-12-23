// Dependencies:
import { createAction, props } from '@ngrx/store';

// Models (used as argument in some actions):
import { User } from './auth.models';

// File creates Actions for registration later.

/**
 * Define as const the 'Register' Action,
 * with required arguments.
 *  @param email email
 *  @param first_name first_name
 *  @param password password
 */
export const Register = createAction('[Authentication] Register', props<{ email: string, first_name: string, password: string }>());

/**
 * Define as const the 'RegisterSuccess' Action,
 * with required arguments:
 * @param user user
 */
export const RegisterSuccess = createAction('[Authentication] Register Success', props<{ user: User }>());

/**
 * Define as const the 'RegisterFailure' Action,
 * with required arguments:
 * @param error error
 */
export const RegisterFailure = createAction('[Authentication] Register Failure', props<{ error: string }>());

/**
 * Define as const the 'Login' Action,
 * with required arguments:
 * Login action.
 * @param email email
 * @param password password
 */
export const login = createAction('[Authentication] Login', props<{ email: string, password: string }>());

/**
 * Define as const the 'LoginSuccess' Action,
 * with required arguments:
 * @param user user
 */
export const loginSuccess = createAction('[Authentication] Login Success', props<{ user: User }>());

/**
 * Define as const the 'LoginFailure' Action,
 * with required arguments:
 * @param error error
 */
export const loginFailure = createAction('[Authentication] Login Failure', props<{ error: string }>());

/**
 * Define as const the 'Logout' Action,
 * with required arguments: (none).
 * 
 */
export const logout = createAction('[Authentication] Logout');

/**
 * Define as const the 'LogoutSuccess' Action,
 * with required arguments: (none).
 */
export const logoutSuccess = createAction('[Auth] Logout Success');


