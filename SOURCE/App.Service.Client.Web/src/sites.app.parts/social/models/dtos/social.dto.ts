/**
 * Social Domain DTOs
 * 
 * Data Transfer Objects for API communication.
 */

/**
 * Person DTO - Matches json-server/API shape
 */
export interface PersonDto {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  emailVerified?: boolean;
  phone?: string;
  title?: string;
  organization?: string;
  department?: string;
  bio?: string;
  avatarUrl?: string;
  timezone?: string;
  locale?: string;
  isActive?: boolean;
  createdUtc?: string;
  modifiedUtc?: string;
}

/**
 * Group DTO
 */
export interface GroupDto {
  id: string;
  name: string;
  description?: string;
  type: string;
  parentGroupId?: string;
  isPublic?: boolean;
  allowJoinRequests?: boolean;
  avatarUrl?: string;
  isActive?: boolean;
  createdUtc?: string;
  modifiedUtc?: string;
  createdByPersonId?: string;
}

/**
 * GroupMember DTO
 */
export interface GroupMemberDto {
  id: string;
  personId: string;
  groupId: string;
  roleId: string;
  status: string;
  joinedUtc?: string;
  invitedByPersonId?: string;
  createdUtc?: string;
  modifiedUtc?: string;
}

/**
 * GroupRole DTO (reference data)
 */
export interface GroupRoleDto {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  permissions: string[];
  sortOrder?: number;
  isSystemRole?: boolean;
}
