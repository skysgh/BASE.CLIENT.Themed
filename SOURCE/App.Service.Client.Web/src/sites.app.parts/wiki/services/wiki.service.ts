/**
 * Wiki Service
 * 
 * Provides access to wiki pages, namespaces, and content.
 * Supports namespace-based permissions and hierarchy.
 */
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, tap, switchMap } from 'rxjs';

import { WIKI_CONSTANTS, WikiConfiguration, WikiNamespaceConfig } from '../constants';
import {
  WikiPage,
  WikiPageMeta,
  WikiPageTreeNode,
  WikiNamespace,
  WikiSearchResult,
  WikiPageRequest,
  WikiPageVersion,
  WikiTocEntry,
} from '../models';

@Injectable({ providedIn: 'root' })
export class WikiService {
  private http = inject(HttpClient);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────

  private _config = signal<WikiConfiguration>(WIKI_CONSTANTS.defaultConfig);
  private _namespaces = signal<WikiNamespace[]>([]);
  private _currentNamespace = signal<string | null>(null);
  private _pages = signal<WikiPageMeta[]>([]);
  private _pageTree = signal<WikiPageTreeNode[]>([]);
  private _currentPage = signal<WikiPage | null>(null);
  private _loading = signal(false);
  private _saving = signal(false);
  private _error = signal<string | null>(null);
  private _userRoles = signal<string[]>(['user']); // Default role for authenticated users

  // Public signals
  readonly config = this._config.asReadonly();
  readonly namespaces = this._namespaces.asReadonly();
  readonly currentNamespace = this._currentNamespace.asReadonly();
  readonly pages = this._pages.asReadonly();
  readonly pageTree = this._pageTree.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed
  readonly isEnabled = computed(() => this._config().enabled);
  readonly editingEnabled = computed(() => this._config().editingEnabled);
  readonly availableNamespaces = computed(() =>
    this._config().namespaces.filter(ns => this.canAccessNamespace(ns.id))
  );

  constructor() {
    this.loadConfig();
  }

  // ─────────────────────────────────────────────────────────────
  // Configuration
  // ─────────────────────────────────────────────────────────────

  /**
   * Load wiki configuration
   */
  private loadConfig(): void {
    // Configuration is loaded from constants by default
    // In a real app, this could be fetched from an API
  }

  /**
   * Set user roles for permission checking
   * This should be called when user authentication state changes
   */
  setUserRoles(roles: string[]): void {
    this._userRoles.set(roles);
  }

  /**
   * Get current user roles
   */
  private getCurrentUserRoles(): string[] {
    return this._userRoles();
  }

  /**
   * Get namespace configuration by ID
   */
  getNamespaceConfig(namespaceId: string): WikiNamespaceConfig | undefined {
    return this._config().namespaces.find(ns => ns.id === namespaceId);
  }

  // ─────────────────────────────────────────────────────────────
  // Permissions
  // ─────────────────────────────────────────────────────────────

  /**
   * Check if current user can access a namespace
   */
  canAccessNamespace(namespaceId: string): boolean {
    const nsConfig = this.getNamespaceConfig(namespaceId);
    if (!nsConfig) return false;

    // Public namespace (no roles required)
    if (nsConfig.readRoles.length === 0) return true;

    // Check user roles
    const userRoles = this.getCurrentUserRoles();
    return nsConfig.readRoles.some(role => userRoles.includes(role));
  }

  /**
   * Check if current user can edit in a namespace
   */
  canEditNamespace(namespaceId: string): boolean {
    if (!this._config().editingEnabled) return false;

    const nsConfig = this.getNamespaceConfig(namespaceId);
    if (!nsConfig) return false;

    const userRoles = this.getCurrentUserRoles();
    return nsConfig.editRoles.some(role => userRoles.includes(role));
  }

  /**
   * Check if current user can edit a specific page
   */
  canEditPage(page: WikiPageMeta): boolean {
    // Check namespace permission first
    if (!this.canEditNamespace(page.namespace)) return false;

    // If page has specific edit roles, check those too
    // (page-level permissions are additive to namespace permissions)
    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // Namespaces
  // ─────────────────────────────────────────────────────────────

  /**
   * Load all accessible namespaces with page counts
   */
  loadNamespaces(): Observable<WikiNamespace[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<WikiNamespace[]>(WIKI_CONSTANTS.api.namespaces).pipe(
      map(namespaces => namespaces.filter(ns => this.canAccessNamespace(ns.id))),
      tap(namespaces => {
        this._namespaces.set(namespaces);
        this._loading.set(false);
      }),
      catchError(err => {
        // Fallback to mock data for development
        const mockNamespaces = this.getMockNamespaces();
        this._namespaces.set(mockNamespaces);
        this._loading.set(false);
        return of(mockNamespaces);
      })
    );
  }

  /**
   * Set current namespace and load its pages
   */
  setCurrentNamespace(namespaceId: string): void {
    if (!this.canAccessNamespace(namespaceId)) {
      this._error.set('Access denied to this namespace');
      return;
    }

    this._currentNamespace.set(namespaceId);
    this.loadPagesForNamespace(namespaceId).subscribe();
  }

  // ─────────────────────────────────────────────────────────────
  // Pages
  // ─────────────────────────────────────────────────────────────

  /**
   * Load pages for a namespace
   */
  loadPagesForNamespace(namespaceId: string): Observable<WikiPageMeta[]> {
    this._loading.set(true);
    this._error.set(null);

    const url = `${WIKI_CONSTANTS.api.pages}?namespace=${namespaceId}`;

    return this.http.get<WikiPageMeta[]>(url).pipe(
      tap(pages => {
        this._pages.set(pages);
        this._pageTree.set(this.buildPageTree(pages));
        this._loading.set(false);
      }),
      catchError(err => {
        // Fallback to mock data
        const mockPages = this.getMockPages(namespaceId);
        this._pages.set(mockPages);
        this._pageTree.set(this.buildPageTree(mockPages));
        this._loading.set(false);
        return of(mockPages);
      })
    );
  }

  /**
   * Load a single page by namespace and slug
   */
  loadPage(namespace: string, slug: string): Observable<WikiPage | null> {
    if (!this.canAccessNamespace(namespace)) {
      this._error.set('Access denied');
      return of(null);
    }

    this._loading.set(true);
    this._error.set(null);
    this._currentNamespace.set(namespace);

    const url = `${WIKI_CONSTANTS.api.pages}/${namespace}/${slug}`;

    return this.http.get<WikiPage>(url).pipe(
      map(page => ({
        ...page,
        toc: this.generateToc(page.content),
        readingTime: this.calculateReadingTime(page.content),
      })),
      tap(page => {
        this._currentPage.set(page);
        this._loading.set(false);
      }),
      catchError(err => {
        // Try mock data
        const mockPage = this.getMockPage(namespace, slug);
        if (mockPage) {
          this._currentPage.set(mockPage);
          this._loading.set(false);
          return of(mockPage);
        }
        this._error.set(`Page not found: ${namespace}/${slug}`);
        this._loading.set(false);
        return of(null);
      })
    );
  }

  /**
   * Clear current page
   */
  clearCurrentPage(): void {
    this._currentPage.set(null);
  }

  /**
   * Create a new page
   */
  createPage(request: WikiPageRequest): Observable<WikiPage | null> {
    if (!this.canEditNamespace(request.namespace)) {
      this._error.set('Permission denied');
      return of(null);
    }

    this._saving.set(true);
    this._error.set(null);

    return this.http.post<WikiPage>(WIKI_CONSTANTS.api.pages, request).pipe(
      tap(page => {
        this._saving.set(false);
        // Refresh pages list
        this.loadPagesForNamespace(request.namespace).subscribe();
      }),
      catchError(err => {
        this._error.set('Failed to create page');
        this._saving.set(false);
        return of(null);
      })
    );
  }

  /**
   * Update an existing page
   */
  updatePage(pageId: string, request: WikiPageRequest): Observable<WikiPage | null> {
    if (!this.canEditNamespace(request.namespace)) {
      this._error.set('Permission denied');
      return of(null);
    }

    this._saving.set(true);
    this._error.set(null);

    const url = `${WIKI_CONSTANTS.api.pages}/${pageId}`;

    return this.http.put<WikiPage>(url, request).pipe(
      tap(page => {
        this._currentPage.set(page);
        this._saving.set(false);
      }),
      catchError(err => {
        this._error.set('Failed to update page');
        this._saving.set(false);
        return of(null);
      })
    );
  }

  /**
   * Delete a page (soft delete)
   */
  deletePage(pageId: string): Observable<boolean> {
    this._saving.set(true);

    const url = `${WIKI_CONSTANTS.api.pages}/${pageId}`;

    return this.http.delete<void>(url).pipe(
      map(() => {
        this._saving.set(false);
        return true;
      }),
      catchError(err => {
        this._error.set('Failed to delete page');
        this._saving.set(false);
        return of(false);
      })
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Search
  // ─────────────────────────────────────────────────────────────

  /**
   * Search pages across accessible namespaces
   */
  searchPages(query: string): Observable<WikiSearchResult[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    const url = `${WIKI_CONSTANTS.api.search}?q=${encodeURIComponent(query)}`;

    return this.http.get<WikiSearchResult[]>(url).pipe(
      map(results => results.filter(r => this.canAccessNamespace(r.page.namespace))),
      catchError(() => of(this.localSearch(query)))
    );
  }

  /**
   * Local search (fallback)
   */
  private localSearch(query: string): WikiSearchResult[] {
    const normalizedQuery = query.toLowerCase();
    const pages = this._pages();

    return pages
      .map(page => {
        let score = 0;

        if (page.title.toLowerCase().includes(normalizedQuery)) {
          score += 10;
        }
        if (page.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))) {
          score += 5;
        }
        if (page.slug.toLowerCase().includes(normalizedQuery)) {
          score += 3;
        }

        return { page, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  // ─────────────────────────────────────────────────────────────
  // History
  // ─────────────────────────────────────────────────────────────

  /**
   * Get page version history
   */
  getPageHistory(pageId: string): Observable<WikiPageVersion[]> {
    if (!this._config().historyEnabled) {
      return of([]);
    }

    const url = `${WIKI_CONSTANTS.api.pages}/${pageId}/history`;

    return this.http.get<WikiPageVersion[]>(url).pipe(
      catchError(() => of([]))
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Utilities
  // ─────────────────────────────────────────────────────────────

  /**
   * Build page tree from flat list
   */
  private buildPageTree(pages: WikiPageMeta[]): WikiPageTreeNode[] {
    const pageMap = new Map<string, WikiPageTreeNode>();
    const rootNodes: WikiPageTreeNode[] = [];

    // Create nodes
    pages.forEach(page => {
      pageMap.set(page.id, { page, children: [] });
    });

    // Build tree
    pages.forEach(page => {
      const node = pageMap.get(page.id)!;
      if (page.parentId && pageMap.has(page.parentId)) {
        pageMap.get(page.parentId)!.children.push(node);
      } else {
        rootNodes.push(node);
      }
    });

    // Sort by order
    const sortNodes = (nodes: WikiPageTreeNode[]) => {
      nodes.sort((a, b) => a.page.order - b.page.order);
      nodes.forEach(node => sortNodes(node.children));
    };
    sortNodes(rootNodes);

    return rootNodes;
  }

  /**
   * Generate table of contents from markdown content
   */
  private generateToc(content: string): WikiTocEntry[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const entries: WikiTocEntry[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = this.slugify(title);

      entries.push({ id, title, level });
    }

    return entries;
  }

  /**
   * Calculate reading time in minutes
   */
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  /**
   * Convert text to URL-safe slug
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Generate full path for a page
   */
  getPagePath(page: WikiPageMeta): string {
    return `${page.namespace}/${page.slug}`;
  }

  /**
   * Get page by path (namespace/slug)
   */
  getPageByPath(path: string): WikiPageMeta | undefined {
    const [namespace, slug] = path.split('/');
    return this._pages().find(p => p.namespace === namespace && p.slug === slug);
  }

  // ─────────────────────────────────────────────────────────────
  // Mock Data (for development)
  // ─────────────────────────────────────────────────────────────

  private getMockNamespaces(): WikiNamespace[] {
    return [
      {
        id: 'public',
        name: 'Public Documentation',
        description: 'Publicly accessible documentation',
        icon: 'bx-globe',
        pages: [],
        pageCount: 8,
      },
      {
        id: 'internal',
        name: 'Internal Wiki',
        description: 'Internal team documentation',
        icon: 'bx-building',
        pages: [],
        pageCount: 12,
      },
    ];
  }

  private getMockPages(namespace: string): WikiPageMeta[] {
    if (namespace === 'public') {
      return [
        // Original pages
        {
          id: 'pub-1',
          namespace: 'public',
          slug: 'getting-started',
          title: 'Getting Started',
          order: 1,
          status: 'published',
          updatedUtc: new Date().toISOString(),
          icon: 'bx-rocket',
        },
        {
          id: 'pub-2',
          namespace: 'public',
          slug: 'installation',
          title: 'Installation Guide',
          parentId: 'pub-1',
          order: 1,
          status: 'published',
          updatedUtc: new Date().toISOString(),
          icon: 'bx-download',
        },
        {
          id: 'pub-3',
          namespace: 'public',
          slug: 'configuration',
          title: 'Configuration',
          parentId: 'pub-1',
          order: 2,
          status: 'published',
          updatedUtc: new Date().toISOString(),
          icon: 'bx-cog',
        },
        {
          id: 'pub-4',
          namespace: 'public',
          slug: 'api-reference',
          title: 'API Reference',
          order: 2,
          status: 'published',
          updatedUtc: new Date().toISOString(),
          icon: 'bx-code-alt',
          tags: ['api', 'reference'],
        },
        {
          id: 'pub-5',
          namespace: 'public',
          slug: 'faq',
          title: 'Frequently Asked Questions',
          order: 3,
          status: 'published',
          updatedUtc: new Date().toISOString(),
          icon: 'bx-help-circle',
          tags: ['faq', 'help'],
        },
        // ═══════════════════════════════════════════════════════════
        // Linked Tutorial Series: page-one → page-two → page-three → page-one
        // ═══════════════════════════════════════════════════════════
        {
          id: 'pub-tutorial-1',
          namespace: 'public',
          slug: 'page-one',
          title: 'Tutorial Part 1: Setup',
          order: 10,
          status: 'published',
          updatedUtc: new Date().toISOString(),
          icon: 'bx-play-circle',
          tags: ['tutorial', 'setup'],
        },
        {
          id: 'pub-tutorial-2',
          namespace: 'public',
          slug: 'page-two',
          title: 'Tutorial Part 2: Components',
          order: 11,
          status: 'published',
          updatedUtc: new Date().toISOString(),
          icon: 'bx-cube',
          tags: ['tutorial', 'components'],
        },
        {
          id: 'pub-tutorial-3',
          namespace: 'public',
          slug: 'page-three',
          title: 'Tutorial Part 3: Services',
          order: 12,
          status: 'published',
          updatedUtc: new Date().toISOString(),
          icon: 'bx-server',
          tags: ['tutorial', 'services'],
        },
      ];
    }
    return [];
  }

  /**
   * Mock page content with specific content for tutorial pages
   */
  private getMockPage(namespace: string, slug: string): WikiPage | null {
    // Check for special tutorial pages with linked navigation
    const tutorialPages = this.getTutorialPageContent(namespace, slug);
    if (tutorialPages) {
      return tutorialPages;
    }

    // Default mock content for other pages
    const mockContent = `# ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

This is a sample wiki page for **${namespace}/${slug}**.

## Overview

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Getting Started

1. First step
2. Second step
3. Third step

## Code Example

\`\`\`typescript
const example = {
  name: 'Wiki Page',
  namespace: '${namespace}',
  slug: '${slug}'
};

console.log(example);
\`\`\`

## Next Steps

- [Related Topic 1](#)
- [Related Topic 2](#)
- [Related Topic 3](#)

> **Note:** This is a sample page for development purposes.
`;

    return {
      id: `${namespace}-${slug}`,
      namespace,
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      contentPath: `wiki/${namespace}/${slug}.md`,
      order: 1,
      readRoles: [],
      editRoles: ['wiki_editor', 'admin'],
      authorId: 'system',
      authorName: 'System',
      createdUtc: new Date().toISOString(),
      updatedUtc: new Date().toISOString(),
      status: 'published',
      version: 1,
      content: mockContent,
      toc: this.generateToc(mockContent),
      readingTime: this.calculateReadingTime(mockContent),
    };
  }

  /**
   * Get tutorial page content with linked navigation (1 → 2 → 3 → 1)
   */
  private getTutorialPageContent(namespace: string, slug: string): WikiPage | null {
    if (namespace !== 'public') return null;

    const tutorialContent: Record<string, { title: string; content: string; order: number }> = {
      'page-one': {
        title: 'Tutorial Part 1: Setup',
        order: 10,
        content: `# Tutorial Part 1: Setup

Welcome to the first part of our Angular tutorial series! This page demonstrates wiki functionality with code syntax highlighting.

## Introduction

In this tutorial, we'll set up a new Angular project from scratch. This is **Part 1 of 3** in our tutorial series.

## Prerequisites

Before we begin, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)

## Step 1: Install Angular CLI

First, install the Angular CLI globally:

\`\`\`bash
npm install -g @angular/cli
\`\`\`

Verify the installation:

\`\`\`bash
ng version
\`\`\`

## Step 2: Create a New Project

Create a new Angular project with the CLI:

\`\`\`bash
ng new my-wiki-app --routing --style=scss
cd my-wiki-app
\`\`\`

## Step 3: Project Structure

Here's the generated project structure:

\`\`\`typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <h1>Welcome to {{ title }}!</h1>
    <router-outlet></router-outlet>
  \`
})
export class AppComponent {
  title = 'my-wiki-app';
}
\`\`\`

## Configuration

Add some basic configuration to your \`angular.json\`:

\`\`\`json
{
  "projects": {
    "my-wiki-app": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/my-wiki-app",
            "index": "src/index.html",
            "main": "src/main.ts"
          }
        }
      }
    }
  }
}
\`\`\`

## Summary

In this part, we:
- ✅ Installed Angular CLI
- ✅ Created a new project
- ✅ Explored the project structure

---

## Navigation

| Previous | Current | Next |
|----------|---------|------|
| [Part 3: Services](page-three) | **Part 1: Setup** | [Part 2: Components](page-two) |

> **Continue to Part 2** → [Tutorial Part 2: Components](page-two)
`
      },

      'page-two': {
        title: 'Tutorial Part 2: Components',
        order: 11,
        content: `# Tutorial Part 2: Components

Welcome to Part 2 of our Angular tutorial! We'll now create reusable components.

## Introduction

Components are the building blocks of Angular applications. This is **Part 2 of 3** in our tutorial series.

## Creating a Component

Generate a new component using the CLI:

\`\`\`bash
ng generate component wiki-card
\`\`\`

This creates:
- \`wiki-card.component.ts\` - Component class
- \`wiki-card.component.html\` - Template
- \`wiki-card.component.scss\` - Styles
- \`wiki-card.component.spec.ts\` - Tests

## Component Code

Here's our WikiCard component:

\`\`\`typescript
// src/app/wiki-card/wiki-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface WikiPage {
  id: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-wiki-card',
  standalone: true,
  template: \`
    <div class="wiki-card" (click)="onSelect()">
      <i class="bx {{ page.icon }}"></i>
      <h3>{{ page.title }}</h3>
      <p>{{ page.description }}</p>
    </div>
  \`,
  styles: [\`
    .wiki-card {
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: box-shadow 0.2s;
    }
    .wiki-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  \`]
})
export class WikiCardComponent {
  @Input() page!: WikiPage;
  @Output() selected = new EventEmitter<WikiPage>();

  onSelect(): void {
    this.selected.emit(this.page);
  }
}
\`\`\`

## Using the Component

Import and use the component in your app:

\`\`\`typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { WikiCardComponent } from './wiki-card/wiki-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WikiCardComponent],
  template: \`
    <h1>Wiki Pages</h1>
    @for (page of pages; track page.id) {
      <app-wiki-card 
        [page]="page"
        (selected)="onPageSelected($event)">
      </app-wiki-card>
    }
  \`
})
export class AppComponent {
  pages = [
    { id: '1', title: 'Getting Started', description: 'Learn the basics', icon: 'bx-rocket' },
    { id: '2', title: 'Components', description: 'Build UI elements', icon: 'bx-cube' },
    { id: '3', title: 'Services', description: 'Share data', icon: 'bx-server' }
  ];

  onPageSelected(page: any): void {
    console.log('Selected:', page.title);
  }
}
\`\`\`

## Component Best Practices

| Practice | Description |
|----------|-------------|
| Single Responsibility | One component = one purpose |
| Smart vs Dumb | Container vs presentational |
| OnPush Strategy | Better performance |
| Signals | Modern reactivity |

## Summary

In this part, we:
- ✅ Generated a component
- ✅ Added inputs and outputs
- ✅ Styled the component
- ✅ Used it in the app

---

## Navigation

| Previous | Current | Next |
|----------|---------|------|
| [Part 1: Setup](page-one) | **Part 2: Components** | [Part 3: Services](page-three) |

> **Continue to Part 3** → [Tutorial Part 3: Services](page-three)
`
      },

      'page-three': {
        title: 'Tutorial Part 3: Services',
        order: 12,
        content: `# Tutorial Part 3: Services

Welcome to Part 3 of our Angular tutorial! We'll create services to manage data.

## Introduction

Services are singleton classes that handle business logic and data management. This is **Part 3 of 3** in our tutorial series.

## Creating a Service

Generate a service:

\`\`\`bash
ng generate service wiki
\`\`\`

## Service Implementation

Here's our WikiService with full CRUD operations:

\`\`\`typescript
// src/app/services/wiki.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface WikiPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  namespace: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class WikiService {
  // State using signals
  private _pages = signal<WikiPage[]>(_);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly pages = this._pages.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed values
  readonly pageCount = computed(() => this._pages().length);
  readonly hasPages = computed(() => this._pages().length > 0);

  constructor(private http: HttpClient) {}

  /**
   * Load all pages for a namespace
   */
  loadPages(namespace: string): Observable<WikiPage[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<WikiPage[]>(\`/api/wiki/\${namespace}\`);
  }

  /**
   * Get a single page by slug
   */
  getPage(namespace: string, slug: string): Observable<WikiPage> {
    return this.http.get<WikiPage>(\`/api/wiki/\${namespace}/\${slug}\`);
  }

  /**
   * Create a new page
   */
  createPage(page: Omit<WikiPage, 'id'>): Observable<WikiPage> {
    return this.http.post<WikiPage>('/api/wiki', page);
  }

  /**
   * Update an existing page
   */
  updatePage(id: string, updates: Partial<WikiPage>): Observable<WikiPage> {
    return this.http.put<WikiPage>(\`/api/wiki/\${id}\`, updates);
  }

  /**
   * Delete a page
   */
  deletePage(id: string): Observable<void> {
    return this.http.delete<void>(\`/api/wiki/\${id}\`);
  }
}
\`\`\`

## Using the Service in a Component

Inject and use the service:

\`\`\`typescript
// src/app/wiki-list/wiki-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { WikiService } from '../services/wiki.service';

@Component({
  selector: 'app-wiki-list',
  standalone: true,
  template: \`
    @if (wikiService.loading()) {
      <div class="spinner">Loading...</div>
    }

    @if (wikiService.error()) {
      <div class="error">{{ wikiService.error() }}</div>
    }

    <div class="page-count">
      Total pages: {{ wikiService.pageCount() }}
    </div>

    @for (page of wikiService.pages(); track page.id) {
      <div class="page-item">
        <h3>{{ page.title }}</h3>
        <p>{{ page.slug }}</p>
      </div>
    }
  \`
})
export class WikiListComponent implements OnInit {
  wikiService = inject(WikiService);

  ngOnInit(): void {
    this.wikiService.loadPages('public').subscribe();
  }
}
\`\`\`

## Dependency Injection

Angular's DI makes services available throughout the app:

\`\`\`typescript
// Three ways to provide a service:

// 1. Root level (singleton for entire app)
@Injectable({ providedIn: 'root' })
export class GlobalService { }

// 2. Module level (singleton per module)
@NgModule({
  providers: [ModuleScopedService]
})
export class FeatureModule { }

// 3. Component level (new instance per component)
@Component({
  providers: [ComponentScopedService]
})
export class MyComponent { }
\`\`\`

## Summary

In this tutorial series, we covered:

| Part | Topic | Key Concepts |
|------|-------|--------------|
| Part 1 | Setup | CLI, Project structure |
| Part 2 | Components | Inputs, Outputs, Templates |
| Part 3 | Services | DI, Signals, HTTP |

---

## 🎉 Congratulations!

You've completed the tutorial series! You now know how to:
- ✅ Set up an Angular project
- ✅ Create reusable components
- ✅ Build services for data management

---

## Navigation

| Previous | Current | Next |
|----------|---------|------|
| [Part 2: Components](page-two) | **Part 3: Services** | [Part 1: Setup](page-one) |

> **Start over** → [Tutorial Part 1: Setup](page-one)
`
      }
    };

    const pageData = tutorialContent[slug];
    if (!pageData) return null;

    return {
      id: `${namespace}-${slug}`,
      namespace,
      slug,
      title: pageData.title,
      contentPath: `wiki/${namespace}/${slug}.md`,
      order: pageData.order,
      readRoles: [],
      editRoles: ['wiki_editor', 'admin'],
      authorId: 'system',
      authorName: 'System',
      createdUtc: new Date().toISOString(),
      updatedUtc: new Date().toISOString(),
      status: 'published',
      version: 1,
      content: pageData.content,
      toc: this.generateToc(pageData.content),
      readingTime: this.calculateReadingTime(pageData.content),
      tags: ['tutorial'],
    };
  }
}
