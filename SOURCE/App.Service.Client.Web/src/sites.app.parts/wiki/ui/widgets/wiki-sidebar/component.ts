/**
 * Wiki Sidebar Component
 * 
 * Navigation sidebar showing page hierarchy within a namespace.
 */
import { Component, Input, Output, EventEmitter, inject, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WikiService } from '../../../services/wiki.service';
import { WikiPageTreeNode } from '../../../models';

@Component({
  selector: 'app-wiki-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="wiki-sidebar">
      <!-- Namespace Header -->
      <div class="sidebar-header mb-3">
        <h6 class="mb-0 text-uppercase text-muted small fw-semibold">
          <i class="bx {{ namespaceIcon() }} me-1"></i>
          {{ namespaceName() }}
        </h6>
      </div>

      <!-- Search -->
      <div class="sidebar-search mb-3">
        <div class="input-group input-group-sm">
          <span class="input-group-text bg-transparent border-end-0">
            <i class="bx bx-search"></i>
          </span>
          <input 
            type="text" 
            class="form-control border-start-0"
            placeholder="Search pages..."
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()">
        </div>
      </div>

      <!-- Loading -->
      @if (wikiService.loading()) {
        <div class="text-center py-3">
          <div class="spinner-border spinner-border-sm text-primary"></div>
        </div>
      }

      <!-- Page Tree -->
      @if (!wikiService.loading()) {
        <nav class="page-tree">
          @if (filteredTree().length === 0) {
            <p class="text-muted small text-center py-3">
              No pages found
            </p>
          }
          
          @for (node of filteredTree(); track node.page.id) {
            <ng-container *ngTemplateOutlet="treeNode; context: { $implicit: node, depth: 0 }"></ng-container>
          }
        </nav>
      }

      <!-- Actions -->
      @if (wikiService.canEditNamespace(namespace)) {
        <div class="sidebar-actions mt-4 pt-3 border-top">
          <a 
            [routerLink]="['../../edit', namespace]"
            class="btn btn-outline-primary btn-sm w-100">
            <i class="bx bx-plus me-1"></i>
            New Page
          </a>
        </div>
      }

      <!-- Recursive Tree Node Template -->
      <ng-template #treeNode let-node let-depth="depth">
        <div 
          class="tree-item"
          [class.active]="isActive(node)"
          [style.padding-left.rem]="depth * 0.75">
          
          <div class="tree-item-content d-flex align-items-center">
            <!-- Expand/Collapse (if has children) -->
            @if (node.children.length > 0) {
              <button 
                type="button"
                class="btn btn-link btn-sm p-0 me-1 text-muted"
                (click)="toggleNode(node)">
                <i class="bx {{ node.expanded ? 'bx-chevron-down' : 'bx-chevron-right' }}"></i>
              </button>
            } @else {
              <span class="tree-spacer"></span>
            }

            <!-- Page Link -->
            <a 
              [routerLink]="['../', namespace, node.page.slug]"
              class="tree-link flex-grow-1"
              [class.fw-semibold]="isActive(node)"
              (click)="onSelect(node)">
              @if (node.page.icon) {
                <i class="bx {{ node.page.icon }} me-1 text-muted"></i>
              } @else {
                <i class="bx bx-file-blank me-1 text-muted"></i>
              }
              {{ node.page.title }}
            </a>

            <!-- Status indicator -->
            @if (node.page.status !== 'published') {
              <span 
                class="badge bg-{{ getStatusColor(node.page.status) }} ms-1"
                style="font-size: 0.65rem;">
                {{ node.page.status }}
              </span>
            }
          </div>

          <!-- Children -->
          @if (node.expanded && node.children.length > 0) {
            <div class="tree-children">
              @for (child of node.children; track child.page.id) {
                <ng-container *ngTemplateOutlet="treeNode; context: { $implicit: child, depth: depth + 1 }"></ng-container>
              }
            </div>
          }
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .wiki-sidebar {
      position: sticky;
      top: 1rem;
      max-height: calc(100vh - 2rem);
      overflow-y: auto;
    }

    .tree-item {
      margin-bottom: 0.25rem;
    }

    .tree-item-content {
      padding: 0.35rem 0.5rem;
      border-radius: 4px;
      transition: background-color 0.15s ease;
    }

    .tree-item-content:hover {
      background-color: var(--vz-light);
    }

    .tree-item.active > .tree-item-content {
      background-color: rgba(var(--vz-primary-rgb), 0.1);
    }

    .tree-link {
      color: inherit;
      text-decoration: none;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tree-link:hover {
      color: var(--vz-primary);
    }

    .tree-spacer {
      width: 1rem;
      display: inline-block;
    }

    .tree-children {
      margin-left: 0.5rem;
      border-left: 1px solid var(--vz-border-color);
      padding-left: 0.25rem;
    }
  `]
})
export class WikiSidebarComponent implements OnInit, OnChanges {
  wikiService = inject(WikiService);

  @Input() namespace: string = '';
  @Input() currentSlug: string = '';
  @Output() pageSelected = new EventEmitter<string>();

  searchQuery = '';
  filteredTree = signal<WikiPageTreeNode[]>([]);
  namespaceName = signal('');
  namespaceIcon = signal('bx-folder');

  ngOnInit(): void {
    this.loadNamespaceInfo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['namespace'] && this.namespace) {
      this.loadNamespaceInfo();
      this.wikiService.loadPagesForNamespace(this.namespace).subscribe(() => {
        this.applyFilter();
        this.expandToCurrentPage();
      });
    }
    if (changes['currentSlug']) {
      this.expandToCurrentPage();
    }
  }

  private loadNamespaceInfo(): void {
    const config = this.wikiService.getNamespaceConfig(this.namespace);
    if (config) {
      this.namespaceName.set(config.name);
      this.namespaceIcon.set(config.icon || 'bx-folder');
    }
  }

  private applyFilter(): void {
    const tree = this.wikiService.pageTree();
    
    if (!this.searchQuery) {
      this.filteredTree.set(tree);
      return;
    }

    const query = this.searchQuery.toLowerCase();
    const filtered = this.filterTree(tree, query);
    this.filteredTree.set(filtered);
  }

  private filterTree(nodes: WikiPageTreeNode[], query: string): WikiPageTreeNode[] {
    const result: WikiPageTreeNode[] = [];
    
    for (const node of nodes) {
      const matches = node.page.title.toLowerCase().includes(query) ||
                     node.page.tags?.some(t => t.toLowerCase().includes(query));
      
      const filteredChildren = this.filterTree(node.children, query);
      
      if (matches || filteredChildren.length > 0) {
        result.push({
          page: node.page,
          children: filteredChildren,
          expanded: filteredChildren.length > 0,
        });
      }
    }
    
    return result;
  }

  private expandToCurrentPage(): void {
    if (!this.currentSlug) return;

    const tree = this.filteredTree();
    const expandPath = (nodes: WikiPageTreeNode[]): boolean => {
      for (const node of nodes) {
        if (node.page.slug === this.currentSlug) {
          node.expanded = true;
          return true;
        }
        if (node.children.length > 0 && expandPath(node.children)) {
          node.expanded = true;
          return true;
        }
      }
      return false;
    };

    expandPath(tree);
    this.filteredTree.set([...tree]);
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  toggleNode(node: WikiPageTreeNode): void {
    node.expanded = !node.expanded;
    this.filteredTree.update(tree => [...tree]);
  }

  isActive(node: WikiPageTreeNode): boolean {
    return node.page.slug === this.currentSlug;
  }

  onSelect(node: WikiPageTreeNode): void {
    this.pageSelected.emit(`${this.namespace}/${node.page.slug}`);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'draft': 'secondary',
      'pending': 'warning',
      'published': 'success',
      'archived': 'dark',
    };
    return colors[status] || 'secondary';
  }
}
