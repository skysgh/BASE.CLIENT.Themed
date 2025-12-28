/**
 * System User View Model
 */
export interface SystemUserViewModel {
  id: string;
  username: string;
  description: string;
  identityId: string;
  displayLabel: string;
  role?: string;
}
