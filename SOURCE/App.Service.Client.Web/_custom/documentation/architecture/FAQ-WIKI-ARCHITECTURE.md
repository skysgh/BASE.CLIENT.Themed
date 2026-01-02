# FAQ & Wiki Architecture Notes

> **Status**: Design notes - captured during development session
> **Date**: 2026-01-01
> **Priority**: Return to after Spike patterns are solid

---

## FAQ Architecture

### Domain Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    FAQ DOMAIN MODEL                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   FaqCategory (Reference Data)     FaqItem (Aggregate Root)     │
│   ┌─────────────────────────┐      ┌─────────────────────────┐  │
│   │ id                      │◄────┤│ id                      │  │
│   │ title (i18n key)        │  1:N ││ categoryId (FK)        │  │
│   │ description             │      ││ question               │  │
│   │ icon                    │      ││ answer                 │  │
│   │ order                   │      ││ order                  │  │
│   │ enabled                 │      ││ enabled                │  │
│   │ cultureCode             │      ││ status (draft/pending/ │  │
│   └─────────────────────────┘      ││         approved/live) │  │
│                                    ││ cultureCode            │  │
│                                    └─────────────────────────┘  │
│                                                                 │
│   Key Insight: FaqItem is the aggregate, FaqCategory is         │
│   reference data (like a lookup table)                          │
└─────────────────────────────────────────────────────────────────┘
```

### Views (Same Models, Different Presentations)

| Context | Location | View | Purpose |
|---------|----------|------|---------|
| **Landing** | sites.anon | FAQ Section | Show N items from selected categories (marketing) |
| **Help** | sites.app.parts/help | FAQ Page | Show all categories/items (user self-service) |
| **Admin** | sites.app.parts/faq | BREAD Views | Manage categories & items (operators) |

### BREAD + Approval Flow for FaqItem

```
BREAD Pattern:
├── Browse  → /admin/items (filtered by category, status)
├── Read    → /admin/items/:id
├── Edit    → /admin/items/:id/edit
├── Add     → /admin/items/add (status: draft)
├── Delete  → Soft delete
│
└── APPROVAL STATE MACHINE:
    ┌────────┐     ┌─────────┐     ┌──────────┐     ┌──────┐
    │ Draft  │────▶│ Pending │────▶│ Approved │────▶│ Live │
    └────────┘     └─────────┘     └──────────┘     └──────┘
         ▲              │
         │              │ (reject with reason)
         └──────────────┘
    
    States:
    - draft: Author is working on it
    - pending: Submitted for review
    - approved: Approved but not yet published
    - live: Visible to end users
```

### Admin Entry Point

The admin BREAD views should be accessible from the user-facing FAQ page:

```
┌────────────────────────────────────────────────────────────────┐
│ FAQ Page (/system/help/faq or /system/faq)                     │
│                                                                │
│ [Manage FAQs]  ← Only visible if user has faq_admin role       │
│                  Links to → /system/faq/admin/items            │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ General Questions                                         │  │
│ │ ▸ What is this service?                                   │  │
│ │ ▸ How do I get started?                                   │  │
│ └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Shared Services

Both sites.anon and sites.app should use the same:
- `FaqCategoryService` (from sites.app.parts/faq)
- `FaqItemService` (from sites.app.parts/faq)
- Models, DTOs, mappers

The only difference is the VIEW:
- sites.anon: `<app-faq-section [categoryIds]="['cat1', 'cat2']" [maxItems]="5">`
- sites.app: `<app-faq-viewer [showAllCategories]="true">`

---

## Wiki Architecture

### Vision

A wiki that:
1. Lives in the app (authenticated editing at `/app/wiki/edit/...`)
2. Can render publicly under another URL (SEO-friendly at `/wiki/...`)
3. Supports namespace-based permissions
4. Could migrate content from DokuWiki

### Storage: Hybrid Approach

| Layer | Location | Contents |
|-------|----------|----------|
| **Metadata** | Database | Page info (namespace, slug, title, permissions, author, timestamps) |
| **Content** | Azure Blob | Markdown files (portable, versionable) |
| **Attachments** | Azure Blob | Images, PDFs, etc. |

**Why Hybrid?**
- Content stays portable (can migrate from/to DokuWiki)
- Database enables search, permissions, versioning metadata
- Blob storage is cheap and scales

### Namespace-Based Permissions

```
┌─────────────────────────────────────────────────────────────────┐
│                        WIKI APP.LET                             │
│                     (sites.app.lets/wiki)                       │
├─────────────────────────────────────────────────────────────────┤
│  EDITING (authenticated)                                        │
│  /app/wiki/edit/:namespace/:slug                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Rich Markdown Editor                                     │   │
│  │ - WYSIWYG mode                                           │   │
│  │ - Raw markdown mode                                      │   │
│  │ - Live preview                                           │   │
│  │ - Media upload                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  READING (auth based on namespace)                              │
│                                                                 │
│  Namespace: /public/*                                           │
│  → Renders at: yoursite.com/wiki/*                              │
│  → SEO optimized, no auth required                              │
│                                                                 │
│  Namespace: /internal/*                                         │
│  → Renders at: yoursite.com/app/wiki/internal/*                 │
│  → Auth required, private docs                                  │
│                                                                 │
│  Namespace: /admin/*                                            │
│  → Renders at: yoursite.com/app/wiki/admin/*                    │
│  → Admin role required                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Wiki Page Model

```typescript
interface WikiPageDto {
  id: string;
  namespace: string;           // e.g., "public", "internal", "admin"
  slug: string;                // e.g., "getting-started"
  title: string;
  contentPath: string;         // Blob path to markdown file
  
  // Hierarchy
  parentId?: string;
  order: number;
  
  // Permissions
  readRoles: string[];         // Empty = public
  editRoles: string[];
  
  // Metadata
  author: string;
  createdUtc: string;
  updatedUtc: string;
  publishedUtc?: string;
  
  // Status
  status: 'draft' | 'pending' | 'published' | 'archived';
  
  // SEO (for public pages)
  metaDescription?: string;
  metaKeywords?: string[];
}
```

### DokuWiki Migration Path

```
DokuWiki Structure:
data/pages/namespace/page.txt
data/media/namespace/image.png

Migration Steps:
1. Scan DokuWiki file structure
2. Parse namespace from path
3. Transform DokuWiki syntax → Markdown
4. Create WikiPageDto records in DB
5. Upload content to Azure Blob
6. Upload media to Azure Blob
7. Update links in content
```

### Use Cases

1. **School Website**: Public wiki for curriculum, private wiki for staff
2. **Personal Knowledge Base**: Private notes, public showcase
3. **Product Documentation**: Public docs, internal release notes
4. **Team Wiki**: Internal knowledge sharing

---

## Approval Screen Pattern

> **Important Discovery**: BREAD needs an Approve step for state changes

### Approval Screen Requirements

When approving a record (FAQ, Wiki page, Support item, etc.):

```
┌────────────────────────────────────────────────────────────────┐
│ Approve: [Record Title]                                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Summary:                                                       │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Key Field 1: Value                                        │  │
│ │ Key Field 2: Value                                        │  │
│ │ Key Field 3: Value                                        │  │
│ │ ...                                                       │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ Submitted by: [Author Name] on [Date]                          │
│ Current Status: Pending                                        │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Comments (optional):                                      │  │
│ │ [                                                       ] │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ [Reject with Reason]              [Approve] [Approve & Publish]│
└────────────────────────────────────────────────────────────────┘
```

### Reusable Approval Component

```typescript
// core/components/approval-panel/approval-panel.component.ts
interface ApprovalConfig {
  entityType: string;           // 'faq', 'wiki-page', 'support-item'
  entityId: string;
  summaryFields: SummaryField[];
  currentStatus: string;
  targetStatuses: string[];     // What can we approve to?
  requireComment: boolean;
}

interface SummaryField {
  label: string;
  value: string | number;
  type: 'text' | 'money' | 'date' | 'badge';
}
```

---

## Next Steps (When Returning)

1. **FaqItem Status Field**: Add `status` to FaqItem model
2. **FaqItem BREAD Views**: Complete Browse, Read, Edit, Add for items
3. **Approval Component**: Create reusable approval panel
4. **sites.anon Integration**: Create `<app-faq-section>` that uses shared service
5. **Role-Based Admin Link**: Show "Manage FAQs" only to admins
6. **Wiki App.Let**: Start with basic BREAD, add namespaces

---

## Related Files

- `sites.app.parts/faq/` - FAQ admin module (partially complete)
- `core/components/faq-viewer/` - Reusable FAQ display component
- `sites.anon/.../faqs/` - Landing page FAQ section
- `sites.app.parts/help/` - Help hub with FAQ link

---

*Recorded for future reference. Return to Spike first to nail the BREAD + approval patterns.*
