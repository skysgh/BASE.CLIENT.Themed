import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Status definition for page header
 */
export interface PageStatus {
  label: string;
  color: string;
  icon?: string;
}

/**
 * Action button definition
 */
export interface PageAction {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
}

/**
 * Read Page Wrapper Component
 * 
 * Standardized "chrome" for Read (detail/view) views.
 * Handles header, status badge, edit button, and layout.
 * 
 * USAGE:
 * ```html
 * <app-read-page
 *   title="My Spike"
 *   [status]="{ label: 'Draft', color: '#6c757d' }"
 *   (edit)="onEdit()">
 *   
 *   <!-- Your content here -->
 *   <app-form-renderer [formDefinition]="formDef" [model]="data" mode="view">
 *   </app-form-renderer>
 *   
 * </app-read-page>
 * ```
 */
@Component({
  selector: 'app-read-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './read-page.component.html',
  styleUrls: ['./read-page.component.scss']
})
export class ReadPageComponent {
  /** Page title (entity title) */
  @Input() title: string = '';
  
  /** Page subtitle */
  @Input() subtitle?: string;
  
  /** Description */
  @Input() description?: string;
  
  /** Icon class */
  @Input() icon: string = 'bx-file';
  
  /** Icon color */
  @Input() iconColor: string = 'var(--vz-primary)';
  
  /** Status badge */
  @Input() status?: PageStatus;
  
  /** Category badge */
  @Input() category?: PageStatus;
  
  /** Show edit button */
  @Input() showEdit: boolean = true;
  
  /** Edit button label */
  @Input() editLabel: string = 'Edit';
  
  /** Show view toggle (formly vs custom) */
  @Input() showViewToggle: boolean = true;
  
  /** Current view mode */
  @Input() viewMode: 'form' | 'custom' = 'form';
  
  /** State transition actions (BREAST workflow) */
  @Input() stateActions: PageAction[] = [];
  
  /** Loading state */
  @Input() loading: boolean = false;
  
  /** Back link */
  @Input() backLink: string = '../';
  
  /** Back label */
  @Input() backLabel: string = 'Back to List';
  
  /** Created date */
  @Input() createdAt?: Date;
  
  /** Modified date */
  @Input() modifiedAt?: Date;
  
  /** Edit clicked */
  @Output() edit = new EventEmitter<void>();
  
  /** State action clicked */
  @Output() stateAction = new EventEmitter<string>();
  
  /** View mode changed */
  @Output() viewModeChange = new EventEmitter<'form' | 'custom'>();
  
  /** Delete clicked */
  @Output() delete = new EventEmitter<void>();

  /** Custom header actions template */
  @ContentChild('headerActions') headerActionsTemplate?: TemplateRef<any>;

  onEdit(): void {
    this.edit.emit();
  }

  onStateAction(actionId: string): void {
    this.stateAction.emit(actionId);
  }

  onViewModeChange(mode: 'form' | 'custom'): void {
    this.viewMode = mode;
    this.viewModeChange.emit(mode);
  }

  onDelete(): void {
    this.delete.emit();
  }
}
