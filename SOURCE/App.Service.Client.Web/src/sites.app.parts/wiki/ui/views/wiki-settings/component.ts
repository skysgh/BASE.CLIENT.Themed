/**
 * Wiki Settings Component
 * 
 * User preferences for wiki display and behavior.
 * Part of the Settings Hub applet tiles.
 */
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';
import { WikiService } from '../../../services/wiki.service';
import { WIKI_CONSTANTS, WikiNamespaceConfig } from '../../../constants/wiki.constants';

export interface WikiPreferences {
  /** Default namespace to show */
  defaultNamespace: string;
  /** Show table of contents */
  showToc: boolean;
  /** Enable syntax highlighting */
  syntaxHighlighting: boolean;
  /** Show page metadata (author, dates) */
  showMetadata: boolean;
  /** Preferred view mode */
  viewMode: 'reader' | 'editor';
}

const DEFAULT_PREFERENCES: WikiPreferences = {
  defaultNamespace: 'public',
  showToc: true,
  syntaxHighlighting: true,
  showMetadata: false,
  viewMode: 'reader',
};

@Component({
  selector: 'app-wiki-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BaseCoreAgPipesModule],
  template: `
    <div class="wiki-settings">
      <!-- Available Wikis -->
      <div class="setting-group mb-4">
        <label class="form-label fw-medium">
          {{ 'BASE.WIKI.DEFAULT_NAMESPACE' | baseTranslate }}
        </label>
        <p class="text-muted small mb-3">
          Choose which wiki to show by default when navigating to the wiki section.
        </p>
        
        <div class="namespace-list">
          @for (ns of availableNamespaces; track ns.id) {
            <div 
              class="namespace-option card mb-2"
              [class.selected]="preferences().defaultNamespace === ns.id"
              (click)="selectNamespace(ns.id)">
              <div class="card-body py-2 px-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="ns-icon bg-primary-subtle text-primary">
                    <i class="bx {{ ns.icon || 'bx-book' }}"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-0">{{ ns.name }}</h6>
                    @if (ns.description) {
                      <small class="text-muted">{{ ns.description }}</small>
                    }
                  </div>
                  @if (preferences().defaultNamespace === ns.id) {
                    <i class="bx bx-check text-success fs-4"></i>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Display Options -->
      <div class="setting-group mb-4">
        <label class="form-label fw-medium">
          {{ 'BASE.WIKI.DISPLAY_OPTIONS' | baseTranslate }}
        </label>
        
        <div class="form-check form-switch mb-2">
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="showToc"
            [ngModel]="preferences().showToc"
            (ngModelChange)="updatePreference('showToc', $event)">
          <label class="form-check-label" for="showToc">
            Show table of contents
          </label>
        </div>
        
        <div class="form-check form-switch mb-2">
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="syntaxHighlighting"
            [ngModel]="preferences().syntaxHighlighting"
            (ngModelChange)="updatePreference('syntaxHighlighting', $event)">
          <label class="form-check-label" for="syntaxHighlighting">
            Enable syntax highlighting in code blocks
          </label>
        </div>
        
        <div class="form-check form-switch mb-2">
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="showMetadata"
            [ngModel]="preferences().showMetadata"
            (ngModelChange)="updatePreference('showMetadata', $event)">
          <label class="form-check-label" for="showMetadata">
            Show page metadata (author, last updated)
          </label>
        </div>
      </div>

      <!-- Default View Mode -->
      <div class="setting-group">
        <label class="form-label fw-medium">
          {{ 'BASE.WIKI.VIEW_MODE' | baseTranslate }}
        </label>
        <p class="text-muted small mb-3">
          Choose how pages open by default.
        </p>
        
        <div class="btn-group w-100" role="group">
          <input 
            type="radio" 
            class="btn-check" 
            name="viewMode" 
            id="viewModeReader"
            [checked]="preferences().viewMode === 'reader'"
            (change)="updatePreference('viewMode', 'reader')">
          <label class="btn btn-outline-primary" for="viewModeReader">
            <i class="bx bx-book-reader me-1"></i>
            Reader Mode
          </label>
          
          <input 
            type="radio" 
            class="btn-check" 
            name="viewMode" 
            id="viewModeEditor"
            [checked]="preferences().viewMode === 'editor'"
            (change)="updatePreference('viewMode', 'editor')">
          <label class="btn btn-outline-primary" for="viewModeEditor">
            <i class="bx bx-edit me-1"></i>
            Editor Mode
          </label>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="mt-4 pt-4 border-top">
        <div class="d-flex gap-2">
          <a [routerLink]="['/system/wiki']" class="btn btn-soft-primary btn-sm">
            <i class="bx bx-book-open me-1"></i>
            Open Wiki
          </a>
          <a [routerLink]="['/system/wiki', preferences().defaultNamespace]" class="btn btn-soft-secondary btn-sm">
            <i class="bx bx-folder-open me-1"></i>
            Browse {{ getNamespaceName(preferences().defaultNamespace) }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wiki-settings {
      padding: 0.5rem 0;
    }
    
    .namespace-option {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        border-color: var(--vz-primary);
      }
      
      &.selected {
        border-color: var(--vz-primary);
        background-color: var(--vz-primary-bg-subtle);
      }
    }
    
    .ns-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    
    .btn-group {
      .btn {
        flex: 1;
      }
    }
  `]
})
export class WikiSettingsComponent implements OnInit {
  private wikiService = inject(WikiService);
  
  /** Available namespaces user can access */
  availableNamespaces: WikiNamespaceConfig[] = [];
  
  /** User preferences signal */
  preferences = signal<WikiPreferences>(DEFAULT_PREFERENCES);
  
  ngOnInit(): void {
    this.loadNamespaces();
    this.loadPreferences();
  }
  
  private loadNamespaces(): void {
    // Get namespaces user has access to
    // For now, use all visible namespaces from constants
    // TODO: Filter by user roles
    this.availableNamespaces = WIKI_CONSTANTS.defaultConfig.namespaces
      .filter(ns => ns.visible);
  }
  
  private loadPreferences(): void {
    // Load from local storage or service
    const stored = localStorage.getItem('wiki-preferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.preferences.set({ ...DEFAULT_PREFERENCES, ...parsed });
      } catch {
        // Use defaults
      }
    }
  }
  
  selectNamespace(namespaceId: string): void {
    this.updatePreference('defaultNamespace', namespaceId);
  }
  
  updatePreference<K extends keyof WikiPreferences>(key: K, value: WikiPreferences[K]): void {
    this.preferences.update(prefs => ({
      ...prefs,
      [key]: value
    }));
    this.savePreferences();
  }
  
  private savePreferences(): void {
    localStorage.setItem('wiki-preferences', JSON.stringify(this.preferences()));
    console.log('[WikiSettings] Preferences saved', this.preferences());
  }
  
  getNamespaceName(namespaceId: string): string {
    return this.availableNamespaces.find(ns => ns.id === namespaceId)?.name || namespaceId;
  }
}
