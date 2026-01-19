# Social Domain Module

The Social domain provides foundational entities for representing people and their organizational relationships.

## Domain Model

### Entities

1. **Person** (Aggregate Root)
   - The real-world human being
   - Contains personal information: name, email, contact info
   - Referenced by User (System domain) - User.personId → Person.id

2. **Group** (Aggregate Root)
   - A collection of people with a purpose
   - Examples: Teams, Departments, Organizations
   - Has members via GroupMember

3. **GroupMember** (Entity within Group)
   - Links Person to Group with a Role
   - person + group + role

4. **GroupRole** (Reference Data)
   - Defines roles within groups: Admin, Member, Viewer
   - Permissions associated with each role

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        System Domain                             │
│  ┌──────────┐                                                   │
│  │   User   │  Authentication identity                          │
│  │          │  - displayName                                    │
│  │          │  - personId (FK to Social.Person)                 │
│  └──────────┘                                                   │
└───────────────────────────────────────│─────────────────────────┘
                                        │
                                        ▼ references
┌─────────────────────────────────────────────────────────────────┐
│                        Social Domain                             │
│  ┌──────────┐     ┌─────────────┐     ┌───────────┐            │
│  │  Person  │ ←── │ GroupMember │ ──→ │   Group   │            │
│  │          │     │             │     │           │            │
│  │ firstName│     │ personId    │     │ name      │            │
│  │ lastName │     │ groupId     │     │ type      │            │
│  │ email    │     │ roleId      │     │ members[] │            │
│  └──────────┘     └─────────────┘     └───────────┘            │
│        │                │                                       │
│        │                ▼                                       │
│        │          ┌───────────┐                                 │
│        └──────────│ GroupRole │ (Reference Data)                │
│                   │           │                                 │
│                   │ admin     │                                 │
│                   │ member    │                                 │
│                   │ viewer    │                                 │
│                   └───────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Key Distinction: User vs Person

| Aspect | User (System) | Person (Social) |
|--------|---------------|-----------------|
| Domain | System infrastructure | Business/Social |
| Purpose | Authentication identity | Real-world individual |
| Contains | displayName, authProviderId | firstName, lastName, email, phone |
| Lifecycle | Created on first login | May exist before user account |
| Example | "john.doe@example.com" | "John Doe, Software Engineer" |

## Usage

Profile module consumes Social.Person to display detailed personal information:

```typescript
// Profile component
const user = authService.currentUser();
const person = personService.getByUserId(user.id);

// Display: person.firstName, person.lastName, person.email
```

## Structure

```
social/
├── models/
│   ├── person.model.ts
│   ├── group.model.ts
│   └── group-role.model.ts
├── dtos/
│   ├── person.dto.ts
│   └── group.dto.ts
├── repositories/
│   ├── person.repository.ts
│   └── group.repository.ts
├── services/
│   ├── person.service.ts
│   └── group.service.ts
├── constants/
│   └── social.constants.ts
└── README.md
```
