# User Domain

Platform applet for **identity management** - establishing WHO users are.

## Scope

This domain handles:
- **Identity** - Who is this user?
- **Federation** - Trust relationships with external Identity Providers (IdPs)
- **Profiles** - User settings at system and account levels

## Sub-Modules

### `/users`
Thin user entity - the core identity record.
- `id`, `enabled`, `validFrom`, `validTo`
- References `Person` (name, gender, contact info live there)
- Intentionally minimal - User is a "system identity", not a person

### `/digital-identities`
Federation/SSO trust layer - links users to external IdPs.
- Azure AD, Google, Facebook, etc.
- Stores: `providerId`, `externalUserId`, `lastAuthenticated`
- Enables: "Sign in with Google" → maps to internal User

### `/system-profiles`
Cross-account user preferences (1:1 with User).
- Theme, language, accessibility settings
- Default account selection
- System-wide notification preferences

### `/account-profiles`
Per-account user settings (1:N - one per Account the user belongs to).
- Account-specific preferences
- Last accessed, favorite items in that account
- Account-specific notification settings

## Key Design Decisions

1. **Profiles point TO User** (not the other way around)
   - User doesn't "have" profiles as properties
   - Profiles are relationships: `SystemProfile.userId`, `AccountProfile.userId`

2. **User is NOT Person**
   - User = system identity (can log in)
   - Person = human being (has a name, gender, DOB)
   - A Person may have multiple Users (different systems)
   - A User always references exactly one Person

3. **Authorization is separate**
   - This domain: WHO you are (identity)
   - Authorization domain: WHAT you can do (permissions, roles)
   - Role assignments live in authorization, not here

## Routes

```
/system/user/
├── users/              - User management (admin)
├── identities/         - Linked identity providers
├── profile/            - Current user's system profile (default)
└── account-profile/    - Current user's account profile
```

## Legacy Redirect

For backward compatibility, `/system/authentication` redirects to `/system/user`.

## Related Domains

- **Authorization** (`/operate` or future `/authorization`) - Roles, permissions, role-assignments
- **Accounts** (`/accounts`) - The tenant/org containers users belong to
- **People** (domain applet) - Person entities referenced by User
