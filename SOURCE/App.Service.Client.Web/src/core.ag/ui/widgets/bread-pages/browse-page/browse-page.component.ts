import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Browse Page Wrapper Component
 * 
 * Standardized "chrome" for Browse (list) views.
 * Handles header, title, actions, view toggle, and empty states.
 * 
 * Applet developers only provide content; chrome is consistent.
 * 
 * USAGE:
 * ```html
 * <app-browse-page
 *   title="Spikes"
 *   icon="bx-bulb"
 *   [itemCount]="items.length"
 *   (add)="onAdd()">
 *   
 *   <!-- Your content here -->
 *   <div *ngFor="let item of items">...</div>
 *   
 * </app-browse-page>
 * ```
 */
@Component({
  selector: 'app-browse-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './browse-page.component.html',
  styleUrls: ['./browse-page.component.scss']
})
export class BrowsePageComponent {
  /** Page title */
  @Input() title: string = 'Items';
  
  /** Page subtitle */
  @Input() subtitle?: string;
  
  /** Icon class (e.g., 'bx-bulb') */
  @Input() icon: string = 'bx-folder';
  
  /** Icon color */
  @Input() iconColor: string = 'var(--vz-primary)';
  
  /** Total item count */
  @Input() itemCount: number = 0;
  
  /** Show add button */
  @Input() showAdd: boolean = true;
  
  /** Add button label */
  @Input() addLabel: string = 'Add';
  
  /** Show view toggle (cards/table/list) */
  @Input() showViewToggle: boolean = true;
  
  /** Current view mode */
  @Input() viewMode: 'cards' | 'table' | 'list' = 'cards';
  
  /** Loading state */
  @Input() loading: boolean = false;
  
  /** Empty state message */
  @Input() emptyMessage: string = 'No items yet';
  
  /** Empty state action label */
  @Input() emptyActionLabel: string = 'Create your first item';
  
  /** Back link */
  @Input() backLink?: string;
  
  /** Back label */
  @Input() backLabel: string = 'Back';
  
  /** Add clicked */
  @Output() add = new EventEmitter<void>();
  
  /** View mode changed */
  @Output() viewModeChange = new EventEmitter<'cards' | 'table' | 'list'>();
  
  /** Refresh clicked */
  @Output() refresh = new EventEmitter<void>();

  /** Custom empty template */
  @ContentChild('emptyTemplate') emptyTemplate?: TemplateRef<any>;
  
  /** Custom header actions template */
  @ContentChild('headerActions') headerActionsTemplate?: TemplateRef<any>;

  onAdd(): void {
    this.add.emit();
  }

  onViewModeChange(mode: 'cards' | 'table' | 'list'): void {
    this.viewMode = mode;
    this.viewModeChange.emit(mode);
  }

  onRefresh(): void {
    this.refresh.emit();
  }
}
