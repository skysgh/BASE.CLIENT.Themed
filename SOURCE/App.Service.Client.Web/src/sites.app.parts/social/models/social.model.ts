/**
 * Social Domain Models
 * 
 * Core entities for the Social domain:
 * - Person: Real-world human being (thin - just identifiers + location)
 * - PersonIdentifier: Value object for names, emails, phones, etc.
 * - PersonIdentifierType: Reference data for identifier types
 * - PersonLocation: Value object for current location
 * - Group: Collection of people
 * - GroupMember: Links Person to Group with Role
 * - GroupRole: Reference data for roles
 * 
 * Key distinction:
 * - User (System domain) = Authentication identity
 * - Person (Social domain) = Real-world human with identifiers
 * - Profile (various) = Context-specific views of a Person
 */

// ═══════════════════════════════════════════════════════════════════
// PersonIdentifierType (Reference Data Entity)
// ═══════════════════════════════════════════════════════════════════

/**
 * PersonIdentifierType - Reference data for types of identifiers
 * 
 * This is a REFERENCE TABLE, not a hardcoded enum.
 * Can be extended over time (fax is out, ESP is in...)
 */
export interface PersonIdentifierType {
  id: string;
  
  /** Display name */
  name: string;
  
  /** Category for grouping */
  category: 'name' | 'contact' | 'social' | 'official' | 'other';
  
  /** Icon for UI */
  icon: string;
  
  /** Description */
  description?: string;
  
  /** Validation pattern (regex) */
  validationPattern?: string;
  
  /** Is this type still active/usable? */
  isActive: boolean;
  
  /** Display order within category */
  sortOrder: number;
}

// ═══════════════════════════════════════════════════════════════════
// PersonIdentifier (Value Object of Person)
// ═══════════════════════════════════════════════════════════════════

/**
 * PersonIdentifier - Value object for identifying a person
 * 
 * This is a VALUE OBJECT because:
 * - No identity of its own (part of Person aggregate)
 * - Immutable - changing it creates a new identifier
 * - Describes the Person
 */
export interface PersonIdentifier {
  /** Reference to identifier type */
  typeId: string;
  
  /** The type details (populated from reference data) */
  type?: PersonIdentifierType;
  
  /** The identifier value */
  value: string;
  
  /** Is this the preferred identifier of this type? (e.g., preferred phone) */
  isPreferred: boolean;
  
  /** Is this a legal/official identifier? (e.g., legal name vs nickname) */
  isLegal: boolean;
  
  /** Is this verified? */
  isVerified: boolean;
  
  /** When was it verified? */
  verifiedUtc?: Date;
}

// ═══════════════════════════════════════════════════════════════════
// PersonLocation (Value Object of Person)
// ═══════════════════════════════════════════════════════════════════

/**
 * PersonLocation - Value object for current location
 * 
 * A person can only be in one location at a time.
 * This is their CURRENT location (not address history).
 */
export interface PersonLocation {
  /** Coordinates */
  latitude?: number;
  longitude?: number;
  
  /** Human-readable location */
  displayName?: string;
  
  /** Accuracy in meters */
  accuracyMeters?: number;
  
  /** When this location was recorded */
  recordedUtc: Date;
  
  /** Source of location data */
  source?: 'gps' | 'ip' | 'manual' | 'checkin';
}

// ═══════════════════════════════════════════════════════════════════
// Person (Thin Entity)
// ═══════════════════════════════════════════════════════════════════

/**
 * Person - The real-world human being (THIN)
 * 
 * Distinct from User (System domain):
 * - User is the authentication identity (has displayName, avatarMediaId via SystemProfile)
 * - Person is the actual human with identifiers
 * - User.personId references Person.id
 * 
 * Person is THIN:
 * - Just id + identifiers[] + location
 * - All other attributes (bio, avatar, job) live in PROFILES
 */
export interface Person {
  id: string;
  
  /** 
   * Identifiers (Value Objects)
   * Names, emails, phones, handles, etc.
   */
  identifiers: PersonIdentifier[];
  
  /**
   * Current location (Value Object)
   * Optional - only if tracking is enabled
   */
  location?: PersonLocation;
  
  // Metadata
  createdUtc?: Date;
  modifiedUtc?: Date;
  isActive?: boolean;
}

/**
 * Helper: Get preferred identifier of a specific type
 */
export function getPreferredIdentifier(
  person: Person, 
  typeId: string
): PersonIdentifier | undefined {
  return person.identifiers.find(i => i.typeId === typeId && i.isPreferred);
}

/**
 * Helper: Get display name (preferred name identifier, or first name found)
 */
export function getPersonDisplayName(person: Person): string {
  const preferredName = person.identifiers.find(
    i => (i.type?.category === 'name' || i.typeId.includes('name')) && i.isPreferred
  );
  if (preferredName) return preferredName.value;
  
  const anyName = person.identifiers.find(
    i => i.type?.category === 'name' || i.typeId.includes('name')
  );
  return anyName?.value || 'Unknown';
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
