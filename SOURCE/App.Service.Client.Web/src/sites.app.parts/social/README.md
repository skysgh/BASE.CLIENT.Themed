# Social Domain Module

The Social domain provides foundational entities for representing people and their relationships.

## Key Distinction: User vs Person vs Profiles

| Concept | Domain | Purpose |
|---------|--------|---------|
| **User** | System | Authentication identity. Email, password hash, tokens. |
| **SystemProfile** | System | How user appears in system. DisplayName, avatar, theme. |
| **Person** | Social | Real-world human being. Identifiers, location. THIN. |
| **Profiles** | Various | Context-specific views of Person. Employment, Health, etc. |

```
User (System) ←── SystemProfile (refs User - system presentation)
  │                 - displayName
  │                 - avatarMediaId
  │                 - theme preferences
  │
  └──→ personId FK
              │
              ▼
         Person (Social) ←── EmploymentProfile (refs Person)
              │            ←── HealthProfile (refs Person)
              │            ←── EducationProfile (refs Person)
              │            ←── DemographicsProfile (refs Person)
              │
              ├── identifiers[] (Value Objects)
              │   ├── { typeId: 'full-name', value: 'John Smith', isPreferred: true }
              │   ├── { typeId: 'email', value: 'john@example.com' }
              │   └── { typeId: 'phone-mobile', value: '+1-555-0100' }
              │
              └── location (Value Object - optional)
                  └── { latitude, longitude, recordedUtc }
```

## Person is THIN

Person only has:
- `id` - unique identifier
- `identifiers[]` - Value Objects (names, emails, phones, handles)
- `location` - Value Object (current location, optional)

**All other attributes live in PROFILES** (manila folders about a person from different contexts).

## PersonIdentifier (Value Object)

Identifiers are **value objects** - no independent identity, part of Person aggregate.

```typescript
interface PersonIdentifier {
  typeId: string;           // Reference to PersonIdentifierType
  value: string;            // The actual value
  isPreferred: boolean;     // Preferred of this type?
  isLegal: boolean;         // Legal/official?
  isVerified: boolean;      // Has it been verified?
}
```

## PersonIdentifierType (Reference Data Table)

Types are **reference data** - a table, not a hardcoded enum. Can be extended over time.

| ID | Name | Category | Active? | Example |
|----|------|----------|---------|---------|
| full-name | Full Name | name | ✓ | "John Smith" |
| given-name | Given Name | name | ✓ | "John" |
| family-name | Family Name | name | ✓ | "Smith" |
| preferred-name | Preferred Name | name | ✓ | "Johnny" |
| email | Email | contact | ✓ | "john@example.com" |
| phone-mobile | Mobile Phone | contact | ✓ | "+1-555-0100" |
| twitter | Twitter/X | social | ✓ | "@johnsmith" |
| linkedin | LinkedIn | social | ✓ | "linkedin.com/in/johnsmith" |
| national-id | National ID | official | ✓ | "123-45-6789" |
| employee-id | Employee ID | official | ✓ | "EMP-001" |
| fax | Fax | contact | ✗ | (deprecated) |

**Categories:** `name`, `contact`, `social`, `official`, `other`

## Profiles (Manila Folders About a Person)

Profiles are **separate entities** that reference Person. Like manila folders about someone from different contexts:

| Profile | Refs | Contains |
|---------|------|----------|
| **SystemProfile** | User | displayName, avatarMediaId, theme, notifications |
| **EmploymentProfile** | Person | job title, company, work history, skills, work photo |
| **HealthProfile** | Person | medical records, conditions, allergies |
| **EducationProfile** | Person | schools, degrees, certifications |
| **DemographicsProfile** | Person | date of birth, gender, ethnicity |
| **ContactProfile** | Person | addresses, emergency contacts |

## Groups

Groups represent collections of people:

```typescript
interface Group {
  id: string;
  name: string;
  type: 'team' | 'department' | 'organization' | 'community';
  parentGroupId?: string;  // Hierarchy
  members?: GroupMember[];
}

interface GroupMember {
  personId: string;
  groupId: string;
  roleId: string;  // References GroupRole
  status: 'active' | 'pending' | 'removed';
}

interface GroupRole {
  id: string;
  name: string;  // 'admin', 'member', 'viewer'
  permissions: string[];
}
```

## Structure

```
social/
├── models/
│   ├── social.model.ts      # Person, PersonIdentifier, PersonIdentifierType, Group
│   └── dtos/
│       └── social.dto.ts
├── repositories/
│   └── social.repository.ts
├── services/
│   └── person.service.ts
├── constants/
│   └── social.constants.ts
└── README.md
```

## API Endpoints

```
/api/rest/social_Persons              # Person CRUD
/api/rest/social_PersonIdentifierTypes # Reference data
/api/rest/social_Groups               # Group CRUD
/api/rest/social_GroupMembers         # Membership
/api/rest/social_GroupRoles           # Reference data
```
