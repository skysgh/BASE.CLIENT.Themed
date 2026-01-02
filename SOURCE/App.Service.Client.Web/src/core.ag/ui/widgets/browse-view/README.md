# BrowseView Component

Reusable component for rendering collections in multiple view modes.

## Overview

BrowseView is the standard renderer for BREAD Browse views. It takes `IUniversalCardData[]` from any CardBroker and renders them in the user's preferred view mode.

## View Modes

| Mode | Description | Best For |
|------|-------------|----------|
| **cards** | Tall cards, 3 per row | Detailed browsing, visual impact |
| **tiles** | Compact horizontal rows | Quick scanning, high density |
| **table** | Sortable columns | Data comparison, sorting |
| **list** | Simple list with chevron | Fast navigation, mobile |

## Usage

```html
<app-browse-view
  [cards]="cards()"
  [columns]="columns"
  [loading]="loading()"
  [emptyMessage]="'No items found'"
  [emptyIcon]="'bx bx-folder-open'"
  [viewMode]="viewMode"
  [sortColumn]="sortColumn()"
  [sortDirection]="sortDirection()"
  [page]="page()"
  [pageSize]="pageSize()"
  [totalCount]="totalCount()"
  (viewModeChange)="setViewMode($event)"
  (sortChange)="onSort($event)"
  (pageChange)="onPageChange($event)"
  (cardClick)="onCardClick($event)"
  (cardAction)="onCardAction($event)">
</app-browse-view>
```

## Inputs

| Input | Type | Description |
|-------|------|-------------|
| `cards` | `IUniversalCardData[]` | Data to display |
| `columns` | `IColumnDefinition[]` | Column definitions for table view |
| `loading` | `boolean` | Show loading spinner |
| `emptyMessage` | `string` | Message when no data |
| `emptyIcon` | `string` | Icon class for empty state |
| `viewMode` | `'cards' \| 'tiles' \| 'table' \| 'list'` | Current view mode |
| `sortColumn` | `string` | Current sort column |
| `sortDirection` | `'asc' \| 'desc'` | Current sort direction |
| `page` | `number` | Current page (1-based) |
| `pageSize` | `number` | Items per page |
| `totalCount` | `number` | Total items (for pagination) |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `viewModeChange` | `ViewMode` | User changed view mode |
| `sortChange` | `{column: string, direction: 'asc' \| 'desc'}` | User clicked sort |
| `pageChange` | `number` | User changed page |
| `cardClick` | `IUniversalCardData` | User clicked a card |
| `cardAction` | `{card, action}` | User clicked card action |

## Sub-Components

- `browse-cards-renderer` - Cards view
- `browse-tiles-renderer` - Tiles view  
- `browse-table-renderer` - Table view
- `browse-list-renderer` - List view
- `browse-view-toggle` - View mode switcher
- `browse-pagination` - Page controls

## Styling

Uses CSS variables from the active theme. Main classes:
- `.browse-view` - Container
- `.browse-view-toggle` - View mode buttons
- `.browse-cards`, `.browse-tiles`, `.browse-table`, `.browse-list` - View containers
