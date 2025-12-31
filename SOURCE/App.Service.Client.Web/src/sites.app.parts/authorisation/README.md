# sites.app.parts/authorisation

Authorization management platform applet.

## Purpose
Manages security principals, roles, permissions, and their associations.

## Sub-Modules

### system-groups/
System-defined groups (similar to Active Directory Security Groups).
Distinct from user-created groups in social domain.

### system-permissions/
Granular permissions that can be granted/denied.

### system-roles/
Collections of permissions assigned to users.

## Core Concepts

### Authorization Model
```
User
  └── has Roles (many-to-many)
        └── has Permissions (many-to-many with +/- grant/deny)
  └── has Permission Overrides (direct +/- overrides)
```

### Why Separate from Social Groups?
- **System Groups (here)**: Security-focused, managed by admins, affect access control
- **Social Groups (in default/social)**: User-created, collaboration-focused, social features

Combining them causes:
1. Security risks (users creating groups with elevated privileges)
2. Confusion about group purpose
3. Complex permission inheritance

## URL Prefix
`/system/authorisation/*`
