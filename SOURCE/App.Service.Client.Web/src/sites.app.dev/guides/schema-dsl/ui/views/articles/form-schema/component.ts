/**
 * Form Schema Article Component
 * 
 * Building edit, add, and view forms with Formly integration.
 * 
 * Route: /dev/guides/schema-dsl/forms
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form-schema-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './component.html',
  styles: [`
    .article-container {
      padding: 1.5rem;
      max-width: 900px;
    }
    
    pre {
      font-size: 12px;
      line-height: 1.4;
    }
  `]
})
export class FormSchemaArticleComponent {
  // Code examples stored as component properties to avoid Angular template parsing issues

  readonly formViewSchemaCode = `interface FormViewSchema {
  version?: string;
  id?: string;
  name?: string;
  
  // Header
  title?: string;               // Static title
  titleTemplate?: string;       // Dynamic: "Edit: {{title}}"
  titleKey?: string;            // i18n key
  icon?: string;
  
  // Fields (from EntitySchema.fields or subset)
  fields?: FormFieldSchema[];
  
  // Organization
  tabs?: FormTab[];             // Tabbed layout
  groups?: FormGroup[];         // Field grouping within tabs
  
  // Layout
  layout?: {
    columns?: number;           // Grid columns (default 12)
    spacing?: 'compact' | 'normal' | 'relaxed';
    showRequiredIndicator?: boolean;
  };
  
  // Behavior
  showBottomActions?: boolean;  // Show Save/Cancel at bottom
  stickyActions?: boolean;      // Sticky action bar
  warnOnUnsavedChanges?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  
  // Actions
  actions?: FormAction[];       // Custom action buttons
  
  // Mode-specific
  mode?: 'add' | 'edit' | 'detail' | 'clone';
}`;

  readonly tabsCode = `tabs: [
  {
    id: 'general',
    label: 'General',
    labelKey: 'TABS.GENERAL',     // i18n
    icon: 'ri-information-line',
    // Option 1: Explicit field list
    fields: ['title', 'description', 'status', 'priority', 'categoryId']
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: 'ri-calendar-line',
    // Option 2: Reference groups
    groups: ['timeline']
  },
  {
    id: 'outcome',
    label: 'Outcome',
    icon: 'ri-flag-line'
    // Option 3: Fields with tab:'outcome' are auto-collected
  },
  {
    id: 'audit',
    label: 'History',
    icon: 'ri-history-line',
    // Show only for existing records
    showIf: { mode: ['edit', 'detail'] }
  }
]`;

  readonly groupsCode = `groups: [
  {
    id: 'basic',
    label: 'Basic Information',
    collapsible: false
  },
  {
    id: 'timeline',
    label: 'Timeline',
    description: 'Schedule and estimation',
    collapsible: true,
    collapsed: false           // Start expanded
  },
  {
    id: 'advanced',
    label: 'Advanced Options',
    collapsible: true,
    collapsed: true            // Start collapsed
  }
]`;

  readonly formlyMappingCode = `function schemaFieldToFormlyField(
  field: FormFieldSchema
): FormlyFieldConfig {
  return {
    key: field.field,
    type: mapTypeToFormly(field.type),
    props: {
      label: field.label,
      placeholder: field.placeholder,
      description: field.helpText,
      required: field.required,
      disabled: field.readonly,
      options: field.options,
      // Select-specific
      ...(field.optionsSource && {
        // Async options loading
      }),
      // Validation
      minLength: field.minLength,
      maxLength: field.maxLength,
      min: field.min,
      max: field.max,
      pattern: field.pattern,
    },
    className: getFieldClassName(field.layout),
    expressions: {
      // Conditional visibility
      hide: field.showIf 
        ? buildShowIfExpression(field.showIf) 
        : undefined
    },
    validators: {
      validation: buildValidators(field)
    }
  };
}`;

  readonly validationCode = `// Field schema validation properties
{
  field: 'email',
  type: 'email',
  label: 'Email',
  required: true,
  pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$',
  
  // Custom validation
  validators: [
    {
      name: 'uniqueEmail',
      message: 'This email is already registered',
      asyncValidator: true,
      endpoint: '/api/validate/email'
    }
  ],
  
  // Validation messages (i18n)
  validationMessages: {
    required: 'VALIDATION.EMAIL_REQUIRED',
    pattern: 'VALIDATION.EMAIL_FORMAT'
  }
}`;

  readonly conditionalCode = `// Show "findings" field only when status is "completed"
{
  field: 'findings',
  type: 'richtext',
  label: 'Findings',
  showIf: {
    field: 'status',
    operator: 'eq',
    value: 'completed'
  }
}

// Show "otherReason" when reason is "other"
{
  field: 'otherReason',
  type: 'text',
  label: 'Please specify',
  showIf: {
    field: 'reason',
    operator: 'eq',
    value: 'other'
  }
}

// Complex conditions (all must be true)
{
  field: 'approvalNotes',
  type: 'textarea',
  label: 'Approval Notes',
  showIf: {
    all: [
      { field: 'status', operator: 'eq', value: 'pending_approval' },
      { field: 'currentUserRole', operator: 'in', value: ['manager', 'admin'] }
    ]
  }
}`;

  readonly modesCode = `// In EntitySchema
views: {
  // Base edit schema
  edit: {
    id: 'spike-edit',
    titleTemplate: 'Edit: {{title}}',
    fields: [...],
    tabs: [...],
    warnOnUnsavedChanges: true
  },
  
  // Add inherits from edit with overrides
  add: {
    title: 'Create New Spike',
    // These fields have different defaults in add mode
    fieldOverrides: {
      'status': { defaultValue: 'draft', readonly: true },
      'createdBy': { hidden: true } // System sets this
    }
  },
  
  // Detail is read-only version of edit
  detail: {
    titleTemplate: '{{title}}',
    // All fields rendered as display-only
    // Actions show "Edit" instead of "Save"
  }
}`;

  readonly actionsCode = `actions: [
  {
    id: 'save',
    label: 'Save',
    labelKey: 'ACTIONS.SAVE',
    icon: 'ri-save-line',
    variant: 'primary',
    type: 'submit',
    showIn: ['add', 'edit']
  },
  {
    id: 'saveAndClose',
    label: 'Save & Close',
    icon: 'ri-save-3-line',
    variant: 'success',
    type: 'submit',
    behavior: 'saveAndClose',
    showIn: ['add', 'edit']
  },
  {
    id: 'cancel',
    label: 'Cancel',
    icon: 'ri-close-line',
    variant: 'secondary',
    type: 'button',
    behavior: 'cancel'
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: 'ri-pencil-line',
    variant: 'primary',
    type: 'button',
    behavior: 'navigateToEdit',
    showIn: ['detail']
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: 'ri-delete-bin-line',
    variant: 'danger',
    type: 'button',
    confirmationMessage: 'Are you sure you want to delete this?',
    showIn: ['edit', 'detail']
  }
]`;
}
