# sites.app.parts/users

User management platform applet.

## Purpose
System-level user administration - distinct from user profiles in social domain.

## Views (DI-BREAST-S Pattern)

| View | Route | Description |
|------|-------|-------------|
| Dashboard | `/system/users` | User management overview |
| Insights | `/system/users/insights` | User analytics & statistics |
| Import | `/system/users/import` | Bulk user import |
| Browse | `/system/users/browse` | List/search all users |
| Read | `/system/users/:id` | View user details |
| Edit | `/system/users/:id/edit` | Modify user |
| Add | `/system/users/add` | Create new user |
| Settings | `/system/users/settings` | User management config |
| Search | `/system/users/search` | Advanced user search |

## Domain Model

### Entities
- **User** - Core user entity (distinct from Principal in auth)
- **UserProfile** - Extended profile data
- **UserStatus** - Active, Suspended, Pending, etc.

### Value Objects  
- Email, Phone, Address

## Integration Points
- Authorisation (role assignments)
- Accounts (user-account relationships)
- Social (user profiles - cross-domain)
