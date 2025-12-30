/**
 * SubSpike Form Definitions
 * 
 * Defines form fields for SubSpike BREAD operations.
 * Uses the unified FormDefinition model for engine-agnostic form rendering.
 */
import { FormDefinition, FormFieldDefinition } from '../../../core/forms/form-definition.model';

/**
 * Base fields shared across all modes
 */
const baseFields: FormFieldDefinition[] = [
  {
    key: 'title',
    type: 'text',
    label: 'Title',
    placeholder: 'Enter sub-spike title',
    required: true,
    validation: {
      minLength: 3,
      maxLength: 100
    }
  },
  {
    key: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Describe this sub-spike...',
    required: false,
    rows: 3
  }
];

/**
 * Additional fields for edit mode
 */
const editFields: FormFieldDefinition[] = [
  {
    key: 'statusId',
    type: 'select',
    label: 'Status',
    required: false,
    options: [
      { value: '1', label: 'Draft' },
      { value: '2', label: 'In Progress' },
      { value: '3', label: 'Review' },
      { value: '4', label: 'Completed' },
      { value: '5', label: 'Cancelled' }
    ],
    defaultValue: '1'
  },
  {
    key: 'sequence',
    type: 'number',
    label: 'Sequence',
    placeholder: 'Display order',
    required: false,
    validation: {
      min: 1,
      max: 999
    }
  },
  {
    key: 'estimatedEffort',
    type: 'number',
    label: 'Estimated Effort (hours)',
    placeholder: 'Hours',
    required: false,
    validation: {
      min: 0,
      max: 1000
    }
  }
];

/**
 * Form definitions by mode
 */
const formDefinitions: Record<string, FormDefinition> = {
  add: {
    id: 'sub-spike-add',
    title: 'Create Sub-Spike',
    description: 'Add a new sub-spike to the parent spike',
    mode: 'add',
    fields: [...baseFields],
    layout: {
      columns: 1
    }
  },
  edit: {
    id: 'sub-spike-edit',
    title: 'Edit Sub-Spike',
    description: 'Modify sub-spike details',
    mode: 'edit',
    fields: [...baseFields, ...editFields],
    layout: {
      columns: 1
    }
  },
  view: {
    id: 'sub-spike-view',
    title: 'Sub-Spike Details',
    description: 'View sub-spike information',
    mode: 'view',
    fields: [...baseFields, ...editFields].map(f => ({ ...f, readonly: true })),
    layout: {
      columns: 1
    }
  }
};

/**
 * Get form definition by mode
 * 
 * @param mode Form mode: 'add' | 'edit' | 'view'
 * @returns FormDefinition for the specified mode
 */
export function getSubSpikeFormDefinition(mode: 'add' | 'edit' | 'view'): FormDefinition {
  return formDefinitions[mode] || formDefinitions['add'];
}
