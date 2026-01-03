# Wiki Module

Full-featured wiki system with namespace-based permissions.

## Features

- **Namespace-based Organization**: Organize pages into public, internal, and admin namespaces
- **Role-based Permissions**: Control read/edit access per namespace
- **Hierarchical Pages**: Nest pages under parent pages for organization
- **Markdown Content**: Write content in Markdown with syntax highlighting
- **Search**: Full-text search across accessible namespaces
- **Version History**: Track changes with version history (when enabled)

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/system/wiki` | WikiHubComponent | Main wiki hub - shows namespaces |
| `/system/wiki/:namespace/:slug` | WikiPageViewComponent | View a wiki page |
| `/system/wiki/edit/:namespace/:slug` | WikiEditorComponent | Edit a wiki page |

## Namespace Configuration

Default namespaces:

```typescript
{
  id: 'public',      // Read: anyone, Edit: wiki_editor, admin
  id: 'internal',    // Read: user, Edit: wiki_editor, admin
  id: 'admin',       // Read: admin, Edit: admin
}
```

## Components

### Views
- `WikiHubComponent` - Namespace browser and search
- `WikiPageViewComponent` - Page viewer with sidebar
- `WikiEditorComponent` - Markdown editor with live preview

### Widgets
- `WikiViewerComponent` - Reusable markdown renderer
- `WikiSidebarComponent` - Page tree navigation

## Services

- `WikiService` - Main service for pages, namespaces, and search

## Models

- `WikiPage` - Full page with content
- `WikiPageMeta` - Page metadata (for lists)
- `WikiPageTreeNode` - Page hierarchy node
- `WikiNamespace` - Namespace with page list
- `WikiSearchResult` - Search result item

## Usage

### Import the module

```typescript
// In your routing module
{
  path: 'wiki',
  loadChildren: () => import('./sites.app.parts/wiki/module').then(m => m.WikiModule)
}
```

### Use the wiki viewer standalone

```html
<app-wiki-viewer 
  [content]="markdownContent"
  [enableSyntaxHighlight]="true">
</app-wiki-viewer>
```

## Storage Architecture

Based on the hybrid approach:
- **Metadata**: Stored in database (permissions, hierarchy, versioning)
- **Content**: Stored in Azure Blob (portable Markdown files)

## Development

The WikiService includes mock data for development. When the API is not available,
it falls back to mock namespaces and pages for testing.
