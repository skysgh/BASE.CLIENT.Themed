/**
 * User DTO
 * 
 * Thin user entity - the core identity record.
 * Intentionally minimal: User is a "system identity", not a person.
 * 
 * Key Design:
 * - User references Person (where name, gender, contact info lives)
 * - User can be enabled/disabled without deleting
 * - validFrom/validTo support temporal access control
 */
export interface UserDto {
  /** Unique identifier */
  id: string;
  
  /** Reference to Person entity (where human details live) */
  personId: string;
  
  /** Whether this user account is currently enabled */
  enabled: boolean;
  
  /** When this user account becomes valid (null = immediately) */
  validFrom: string | null;
  
  /** When this user account expires (null = never) */
  validTo: string | null;
  
  /** When the user was created */
  createdAt: string;
  
  /** When the user was last updated */
  updatedAt: string;
  
  /** Soft delete timestamp (null = not deleted) */
  deletedAt: string | null;
}

/**
 * Create User Request
 */
export interface CreateUserDto {
  personId: string;
  enabled?: boolean;
  validFrom?: string | null;
  validTo?: string | null;
}

/**
 * Update User Request
 */
export interface UpdateUserDto {
  enabled?: boolean;
  validFrom?: string | null;
  validTo?: string | null;
}
