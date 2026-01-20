/**
 * Social Domain DTOs
 * 
 * Data Transfer Objects for API communication.
 */

import { PersonIdentifier, PersonLocation } from '../social.model';

/**
 * Person DTO - Matches json-server/API shape
 * 
 * Person is THIN: id + identifiers[] + location
 */
export interface PersonDto {
  id: string;
  identifiers: PersonIdentifier[];
  location?: PersonLocation;
  isActive?: boolean;
  createdUtc?: string;
  modifiedUtc?: string;
}

/**
 * PersonIdentifierType DTO - Reference data
 */
export interface PersonIdentifierTypeDto {
  id: string;
  name: string;
  category: 'name' | 'contact' | 'social' | 'official' | 'other';
  icon: string;
  description?: string;
  validationPattern?: string;
  isActive: boolean;
  sortOrder: number;
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
