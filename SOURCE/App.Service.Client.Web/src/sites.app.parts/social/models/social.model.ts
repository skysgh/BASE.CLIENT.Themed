/**
 * Social Domain Models
 * 
 * Core entities for the Social domain:
 * - Person: Real-world human being
 * - Group: Collection of people
 * - GroupMember: Links Person to Group with Role
 * - GroupRole: Reference data for roles
 */

// ═══════════════════════════════════════════════════════════════════
// Person
// ═══════════════════════════════════════════════════════════════════

/**
 * Person - The real-world human being
 * 
 * Distinct from User (System domain):
 * - User is the authentication identity
 * - Person is the actual human with all their attributes
 * - User.personId references Person.id
 */
export interface Person {
  id: string;
  
  // Name
  firstName: string;
  lastName: string;
  preferredName?: string;  // How they want to be addressed
  fullName?: string;       // Computed: firstName + lastName
  
  // Contact
  email: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  
  // Profile
  title?: string;          // Job title
  organization?: string;   // Company/org name
  department?: string;
  bio?: string;
  
  // Media
  avatarUrl?: string;
  avatarMediaId?: string;  // FK to Media domain (when implemented)
  
  // Preferences
  timezone?: string;
  locale?: string;
  
  // Metadata
  createdUtc?: Date;
  modifiedUtc?: Date;
  isActive?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// Group
// ═══════════════════════════════════════════════════════════════════

/**
 * Group - A collection of people with a purpose
 * 
 * Examples: Teams, Departments, Organizations, Project Groups
 */
export interface Group {
  id: string;
  
  // Identity
  name: string;
  description?: string;
  type: GroupType;
  
  // Hierarchy
  parentGroupId?: string;  // For nested groups (e.g., Department → Team)
  
  // Settings
  isPublic?: boolean;      // Discoverable by non-members
  allowJoinRequests?: boolean;
  
  // Media
  avatarUrl?: string;
  avatarMediaId?: string;
  
  // Membership (populated from GroupMember)
  memberCount?: number;
  
  // Metadata
  createdUtc?: Date;
  modifiedUtc?: Date;
  createdByPersonId?: string;
  isActive?: boolean;
}

/**
 * Group type classification
 */
export type GroupType = 
  | 'team'           // Small working group
  | 'department'     // Organizational unit
  | 'organization'   // Top-level entity
  | 'project'        // Project-based group
  | 'community'      // Open community
  | 'custom';        // User-defined

// ═══════════════════════════════════════════════════════════════════
// Group Membership
// ═══════════════════════════════════════════════════════════════════

/**
 * GroupMember - Links a Person to a Group with a Role
 * 
 * This is the *-* relationship between Person and Group
 */
export interface GroupMember {
  id: string;
  
  // Relationships
  personId: string;
  groupId: string;
  roleId: string;
  
  // Expanded references (when loaded)
  person?: Person;
  group?: Group;
  role?: GroupRole;
  
  // Membership details
  joinedUtc?: Date;
  invitedByPersonId?: string;
  
  // Status
  status: MembershipStatus;
  
  // Metadata
  createdUtc?: Date;
  modifiedUtc?: Date;
}

export type MembershipStatus = 
  | 'active'         // Full member
  | 'pending'        // Invitation sent, not accepted
  | 'suspended'      // Temporarily disabled
  | 'left'           // Voluntarily left
  | 'removed';       // Removed by admin

// ═══════════════════════════════════════════════════════════════════
// Group Role (Reference Data)
// ═══════════════════════════════════════════════════════════════════

/**
 * GroupRole - Defines roles within groups
 * 
 * Standard roles: Admin, Member, Viewer
 * Custom roles can be added per-group type
 */
export interface GroupRole {
  id: string;
  
  // Identity
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  
  // Permissions
  permissions: GroupPermission[];
  
  // Ordering
  sortOrder?: number;
  
  // System
  isSystemRole?: boolean;  // Cannot be deleted/modified
}

/**
 * Permission flags for group roles
 */
export type GroupPermission = 
  | 'view'              // Can view group content
  | 'edit'              // Can edit group content
  | 'delete'            // Can delete group content
  | 'invite'            // Can invite members
  | 'remove_member'     // Can remove members
  | 'change_roles'      // Can change member roles
  | 'manage_settings'   // Can change group settings
  | 'admin';            // Full admin access

// ═══════════════════════════════════════════════════════════════════
// Default Reference Data
// ═══════════════════════════════════════════════════════════════════

export const DEFAULT_GROUP_ROLES: GroupRole[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to manage the group',
    icon: 'ri-shield-user-line',
    color: '#dc3545',
    permissions: ['view', 'edit', 'delete', 'invite', 'remove_member', 'change_roles', 'manage_settings', 'admin'],
    sortOrder: 1,
    isSystemRole: true,
  },
  {
    id: 'member',
    name: 'Member',
    description: 'Can view and contribute to the group',
    icon: 'ri-user-line',
    color: '#0d6efd',
    permissions: ['view', 'edit'],
    sortOrder: 2,
    isSystemRole: true,
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Can view group content only',
    icon: 'ri-eye-line',
    color: '#6c757d',
    permissions: ['view'],
    sortOrder: 3,
    isSystemRole: true,
  },
];
