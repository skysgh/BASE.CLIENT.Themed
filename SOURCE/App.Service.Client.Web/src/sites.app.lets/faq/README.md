# FAQ App.Let

Self-contained FAQ management system with dynamic categories.

**Location**: `sites.app.lets/faq/` (moved from app.parts - it's a full CRUD domain)

## Purpose

- **End Users**: Browse FAQs organized by category
- **Account Admins**: Manage FAQ categories and items (BREAD pattern)

## Why App.Let (not App.Part)?

FAQ is a **Producer** module - it manages content with full CRUD operations.
The `help` app.part is a **Consumer** that renders FAQ content for users.

## Domain Model

```
FaqCategory (1) ──────────> (N) FaqItem
     │                           │
     ├─ id                       ├─ id
     ├─ title (i18n key)         ├─ categoryId (FK)
     ├─ description              ├─ question
     ├─ icon                     ├─ answer
     ├─ order                    ├─ order
     ├─ enabled                  ├─ enabled
     └─ createdAt/updatedAt      └─ createdAt/updatedAt
```

## BREAD Routes

### Category Management (Admin)
| Operation | Route | Component |
|-----------|-------|-----------|
| Browse | `/admin/categories` | CategoryBrowseComponent |
| Read | `/admin/categories/:id` | CategoryReadComponent |
| Edit | `/admin/categories/:id/edit` | CategoryEditComponent |
| Add | `/admin/categories/add` | CategoryAddComponent |
| Delete | (soft delete via edit) | - |

### FAQ Items (Admin)
| Operation | Route | Component |
|-----------|-------|-----------|
| Browse | `/admin/items` | ItemBrowseComponent |
| Read | `/admin/items/:id` | ItemReadComponent |
| Edit | `/admin/items/:id/edit` | ItemEditComponent |
| Add | `/admin/items/add` | ItemAddComponent |

### Public View
| Operation | Route | Component |
|-----------|-------|-----------|
| Hub | `/` | FaqHubComponent |
| Category | `/category/:id` | CategoryViewComponent |

## Reusable Component

The `FaqViewerComponent` in `core/components/faq-viewer` can be used:
- In sites.anon landing page
- In sites.app help section
- Anywhere FAQs need to be displayed

It loads categories dynamically from the FaqCategoryService.

## Configuration

Account-level config:
```json
{
  "faq": {
    "enabled": true,
    "defaultCulture": "en",
    "maxItemsPerCategory": 10
  }
}
```

## Integration

- **Help Hub**: Links to FAQ section
- **Landing Page**: Uses FaqViewerComponent
- **Universal Search**: FaqItem card broker for search
