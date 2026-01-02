# Help App.Part

Platform applet for user documentation and training.

## Features

- **Dual Mode**: Internal wiki OR external URL redirect
- **Culture-Aware**: Articles by language (en, fr, etc.)
- **Markdown Rendering**: Simple article format
- **Category Browsing**: Organized by topic
- **Search**: Full-text search across articles
- **Feedback**: "Was this helpful?" tracking

## Configuration

Configure via account settings:

```json
{
  "help": {
    "enabled": true,
    "mode": "internal",
    "externalUrl": null,
    "externalNewTab": true,
    "defaultCulture": "en",
    "availableCultures": ["en"]
  }
}
```

### External Mode

To redirect to external documentation (Confluence, GitBook, Notion, etc.):

```json
{
  "help": {
    "mode": "external",
    "externalUrl": "https://docs.yourcompany.com",
    "externalNewTab": true
  }
}
```

## Article Structure

Articles are stored as JSON files in `/assets/help/{culture}/articles/`:

```json
{
  "id": "getting-started",
  "title": "Getting Started",
  "description": "Learn the basics",
  "category": "getting-started",
  "tags": ["intro", "basics"],
  "culture": "en",
  "order": 1,
  "published": true,
  "content": "# Getting Started\n\nWelcome to..."
}
```

## Directory Structure

```
assets/help/
├── en/
│   ├── index.json          # Article metadata index
│   ├── categories.json     # Category definitions
│   └── articles/
│       ├── getting-started.json
│       ├── user-guide-overview.json
│       └── faq.json
├── fr/
│   └── ...
```

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/system/help` | HelpHubComponent | Main hub with categories and search |
| `/system/help/article/:id` | ArticleViewerComponent | View single article |
| `/system/help/category/:id` | CategoryViewerComponent | Browse category |

## Usage

### Link to Help

```html
<a routerLink="/system/help">Help & Documentation</a>
```

### Deep Link to Article

```html
<a routerLink="/system/help/article/getting-started">Getting Started Guide</a>
```

### Programmatic Navigation

```typescript
import { HelpService } from 'sites.app.parts/help';

class MyComponent {
  constructor(private helpService: HelpService) {}
  
  openHelp() {
    const url = this.helpService.getHelpUrl('getting-started');
    this.router.navigateByUrl(url);
  }
}
```

## Adding Articles

1. Create article JSON in `/assets/help/{culture}/articles/`
2. Add entry to `index.json` with metadata
3. Article will appear in category and search

## Future Enhancements

- [ ] Markdown library integration (marked/ngx-markdown)
- [ ] Table of contents generation
- [ ] Print-friendly view
- [ ] Article versioning
- [ ] User contributions/feedback
- [ ] Video tutorials
- [ ] Interactive walkthroughs
