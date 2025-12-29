import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Edit Page Wrapper Component
 * 
 * Standardized "chrome" for Edit/Add views.
 * Handles header, save/cancel actions, and unsaved changes warning.
 * 
 * USAGE:
 * ```html
 * <app-edit-page
 *   title="Edit Spike"
 *   [isNew]="false"
 *   [hasChanges]="form.dirty"
 *   [isValid]="form.valid"
 *   (save)="onSave()"
 *   (cancel)="onCancel()">
 *   
 *   <!-- Your form here -->
 *   <app-form-renderer [formDefinition]="formDef" [model]="data" mode="edit">
 *   </app-form-renderer>
 *   
 * </app-edit-page>
 * ```
 */
@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent {
  /** Page title */
  @Input() title: string = 'Edit';
  
  /** Is this a new item (add mode) */
  @Input() isNew: boolean = false;
  
  /** Icon class */
  @Input() icon: string = 'bx-edit';
  
  /** Icon color */
  @Input() iconColor: string = 'var(--vz-primary)';
  
  /** Form has unsaved changes */
  @Input() hasChanges: boolean = false;
  
  /** Form is valid */
  @Input() isValid: boolean = true;
  
  /** Saving in progress */
  @Input() saving: boolean = false;
  
  /** Save button label */
  @Input() saveLabel?: string;
  
  /** Cancel button label */
  @Input() cancelLabel: string = 'Cancel';
  
  /** Show delete button (edit mode only) */
  @Input() showDelete: boolean = false;
  
  /** Back link for cancel */
  @Input() backLink: string = '../';
  
  /** Save clicked */
  @Output() save = new EventEmitter<void>();
  
  /** Cancel clicked */
  @Output() cancel = new EventEmitter<void>();
  
  /** Delete clicked */
  @Output() delete = new EventEmitter<void>();

  /** Custom header actions template */
  @ContentChild('headerActions') headerActionsTemplate?: TemplateRef<any>;

  get computedSaveLabel(): string {
    if (this.saveLabel) return this.saveLabel;
    return this.isNew ? 'Create' : 'Save';
  }

  get computedTitle(): string {
    if (this.title) return this.title;
    return this.isNew ? 'Create New' : 'Edit';
  }

  onSave(): void {
    if (this.isValid && !this.saving) {
      this.save.emit();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }
}
