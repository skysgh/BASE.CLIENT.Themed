# Support App.Part

User-facing support system for submitting and tracking issues and ideas.

## Purpose

Allow users to:
- **Report Issues**: Bugs, problems, complaints
- **Share Ideas**: Feature requests, suggestions
- **Track Progress**: See status updates on their submissions
- **Add Comments**: Communicate with support team

## BREAD Pattern

| Operation | Route | Component | Description |
|-----------|-------|-----------|-------------|
| Browse | `/my-items` | ItemBrowseComponent | View all submissions (cards/list/board) |
| Read | `/item/:id` | ItemReadComponent | View single item with progress |
| Edit | (admin only) | - | Future: Admin can edit items |
| Add | `/new/:type` | ItemAddComponent | Submit new issue or idea |
| Delete | (future) | - | Soft delete/archive |

## Views

### Support Hub (`/`)
Entry point with:
- Stats cards (total, open, resolved)
- Quick actions (Report Issue, Share Idea)
- Recent open items preview

### Item Browse (`/my-items`)
List of user's submissions with:
- Filter tabs (All, Open, Issues, Ideas)
- View modes: Cards, List, Board
- Board view is **read-only** (user can't change status)

### Item Read (`/item/:id`)
Single item detail with:
- Progress visualization (status steps)
- Comments section
- External tracker link (if integrated)

### Item Add (`/new/issue` or `/new/idea`)
Form to submit new item with:
- Title, Description
- Priority selection
- Category (optional)

## Status Workflow

```
New → Triaged → In Progress → Resolved → Closed
```

Users can see their item's progress but cannot change status.

## Configuration

Account-level config controls:
```json
{
  "support": {
    "enabled": true,
    "mode": "internal",
    "allowIssues": true,
    "allowIdeas": true
  }
}
```

Set `mode: "external"` and provide `externalUrl` to redirect to external system.

## Future: Admin Features

Admin-only features (role-gated):
- Full Kanban board with drag-drop
- Status changes
- Assignment
- Priority management
- Integration with Jira/Azure DevOps

## Integration Points

### Universal Search
Card broker registers support items for search.

### Help Hub
Links to Support when `support.enabled` is true.

### External Ticket Systems
Future: Sync with Jira, Azure DevOps, GitHub Issues.
