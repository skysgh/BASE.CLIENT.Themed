# Trash App.Part

System-level trash/recycle bin for soft-deleted items across all entity types.

## Overview

Provides a unified view of deleted items from all registered CardBrokers that support trash operations.

## Features

- **Unified view**: Deleted items from all entity types in one place
- **Restore**: Restore deleted items back to active state
- **Permanent delete**: Optionally permanently delete (Admin only)
- **Auto-expire**: Items may be auto-deleted after configurable period (e.g., 30 days)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Trash Hub                                                   │
├─────────────────────────────────────────────────────────────┤
│ Aggregates deleted items from all brokers:                  │
│                                                             │
│  SpikeCardBroker.getDeletedItems()  ─┐                      │
│  SupportCardBroker.getDeletedItems() ├──► TrashService      │
│  FaqCardBroker.getDeletedItems()    ─┘                      │
│                                                             │
│ Actions delegated back via entityType:                      │
│                                                             │
│  TrashService.restore('spike', 'id')                        │
│    └──► CardBrokerRegistry.restore('spike', 'id')           │
│          └──► SpikeCardBroker.restore('id')                 │
└─────────────────────────────────────────────────────────────┘
```

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/apps/system/trash` | TrashHubComponent | View all deleted items |

## Access

- Topbar trash icon (with badge count)
- User menu → Trash

## Rights

| Action | Required Role |
|--------|---------------|
| View trash | Any authenticated user (sees own items) |
| Restore | Owner, Editor, Admin |
| Delete permanently | Admin only |

## Future Enhancements

- [ ] Bulk restore/delete
- [ ] Auto-expire after N days
- [ ] Filter by entity type
- [ ] Search within trash
