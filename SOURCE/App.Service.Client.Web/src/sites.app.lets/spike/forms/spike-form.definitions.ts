/**
 * Spike Form Definitions
 * 
 * Engine-agnostic form definitions for Spike entity.
 * Can be rendered by Formly or JSON Forms via adapters.
 */

import { FormDefinition, FormFieldDefinition } from '../../../core/forms/form-definition.model';
import { DEFAULT_SPIKE_CATEGORIES } from '../domain/reference-data/spike-category.model';
import { DEFAULT_SPIKE_CLASSIFICATIONS } from '../domain/reference-data/spike-classification.model';
import { DEFAULT_SPIKE_STATUSES } from '../domain/reference-data/spike-status.model';

/**
 * Spike View Form (Read-only)
 */
export const SPIKE_VIEW_FORM: FormDefinition = {
  id: 'spike-view',
  title: 'Spike Details',
  mode: 'view',
  fields: [
    {
      key: 'title',
      type: 'text',
      label: 'Title',
      readonly: true,
    },
    {
      key: 'description',
      type: 'textarea',
      label: 'Description',
      readonly: true,
      rows: 3,
    },
    {
      key: 'categoryId',
      type: 'select',
      label: 'Category',
      readonly: true,
      options: DEFAULT_SPIKE_CATEGORIES.map(c => ({ value: c.id, label: c.name })),
    },
    {
      key: 'statusId',
      type: 'select',
      label: 'Status',
      readonly: true,
      options: DEFAULT_SPIKE_STATUSES.map(s => ({ value: s.id, label: s.name })),
    },
    {
      key: 'priority',
      type: 'select',
      label: 'Priority',
      readonly: true,
      options: [
        { value: 1, label: 'Lowest' },
        { value: 2, label: 'Low' },
        { value: 3, label: 'Medium' },
        { value: 4, label: 'High' },
        { value: 5, label: 'Highest' },
      ],
    },
    {
      key: 'dueDate',
      type: 'date',
      label: 'Due Date',
      readonly: true,
    },
    {
      key: 'estimatedEffort',
      type: 'number',
      label: 'Estimated Effort (hours)',
      readonly: true,
    },
    {
      key: 'classificationIds',
      type: 'multiselect',
      label: 'Tags',
      readonly: true,
      options: DEFAULT_SPIKE_CLASSIFICATIONS.map(c => ({ value: c.id, label: c.name })),
    },
  ],
  layout: {
    columns: 2,
    sections: [
      { id: 'basic', title: 'Basic Information', fieldKeys: ['title', 'description'] },
      { id: 'classification', title: 'Classification', fieldKeys: ['categoryId', 'statusId', 'priority', 'classificationIds'] },
      { id: 'planning', title: 'Planning', fieldKeys: ['dueDate', 'estimatedEffort'] },
    ],
  },
};

/**
 * Spike Edit Form
 */
export const SPIKE_EDIT_FORM: FormDefinition = {
  id: 'spike-edit',
  title: 'Edit Spike',
  mode: 'edit',
  fields: [
    {
      key: 'title',
      type: 'text',
      label: 'Title',
      placeholder: 'Enter spike title',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 200,
        messages: {
          required: 'Title is required',
          minLength: 'Title must be at least 3 characters',
          maxLength: 'Title cannot exceed 200 characters',
        },
      },
    },
    {
      key: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Describe the spike objective, scope, and expected outcomes...',
      rows: 3,
      validation: {
        maxLength: 2000,
      },
    },
    {
      key: 'categoryId',
      type: 'select',
      label: 'Category',
      required: true,
      validation: {
        messages: {
          required: 'Please select a category',
        },
      },
      options: DEFAULT_SPIKE_CATEGORIES.map(c => ({ value: c.id, label: c.name })),
    },
    {
      key: 'priority',
      type: 'select',
      label: 'Priority',
      required: true,
      defaultValue: 3,
      options: [
        { value: 1, label: 'Lowest' },
        { value: 2, label: 'Low' },
        { value: 3, label: 'Medium' },
        { value: 4, label: 'High' },
        { value: 5, label: 'Highest' },
      ],
    },
    {
      key: 'dueDate',
      type: 'date',
      label: 'Due Date',
      placeholder: 'Select due date',
    },
    {
      key: 'estimatedEffort',
      type: 'number',
      label: 'Estimated Effort (hours)',
      placeholder: '0',
      validation: {
        min: 0,
        max: 10000,
      },
    },
    {
      key: 'classificationIds',
      type: 'multiselect',
      label: 'Tags',
      options: DEFAULT_SPIKE_CLASSIFICATIONS.map(c => ({ value: c.id, label: c.name })),
    },
  ],
  layout: {
    columns: 2,
    sections: [
      { id: 'basic', title: 'Basic Information', fieldKeys: ['title', 'description'] },
      { id: 'classification', title: 'Classification', fieldKeys: ['categoryId', 'priority', 'classificationIds'] },
      { id: 'planning', title: 'Planning', fieldKeys: ['dueDate', 'estimatedEffort'] },
    ],
  },
};

/**
 * Spike Add Form (Create new)
 */
export const SPIKE_ADD_FORM: FormDefinition = {
  id: 'spike-add',
  title: 'Create New Spike',
  mode: 'add',
  fields: [
    ...SPIKE_EDIT_FORM.fields,
    // Status is hidden and defaulted to Draft for new spikes
    {
      key: 'statusId',
      type: 'hidden',
      label: 'Status',
      defaultValue: '1', // Draft
    },
  ],
  layout: SPIKE_EDIT_FORM.layout,
};

/**
 * Get form definition by mode
 */
export function getSpikeFormDefinition(mode: 'view' | 'edit' | 'add'): FormDefinition {
  switch (mode) {
    case 'view':
      return SPIKE_VIEW_FORM;
    case 'edit':
      return SPIKE_EDIT_FORM;
    case 'add':
      return SPIKE_ADD_FORM;
  }
}
