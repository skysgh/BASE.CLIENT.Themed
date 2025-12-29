/**
 * SpikeItem Form Definitions
 * 
 * Form definitions for SpikeItem child entity.
 */

import { FormDefinition } from '../../../core/forms/form-definition.model';
import { DEFAULT_SPIKE_ITEM_TYPES } from '../domain/reference-data/spike-item-type.model';

/**
 * SpikeItem Edit Form
 */
export const SPIKE_ITEM_EDIT_FORM: FormDefinition = {
  id: 'spike-item-edit',
  title: 'Edit Item',
  mode: 'edit',
  fields: [
    {
      key: 'typeId',
      type: 'select',
      label: 'Type',
      required: true,
      options: DEFAULT_SPIKE_ITEM_TYPES.map(t => ({ value: t.id, label: t.name })),
    },
    {
      key: 'description',
      type: 'text',
      label: 'Description',
      required: true,
      placeholder: 'Item description',
      validation: {
        minLength: 2,
        maxLength: 500,
      },
    },
    {
      key: 'quantity',
      type: 'number',
      label: 'Quantity',
      validation: {
        min: 0,
      },
    },
    {
      key: 'unit',
      type: 'text',
      label: 'Unit',
      placeholder: 'e.g., hours, items, days',
    },
    {
      key: 'unitPrice',
      type: 'number',
      label: 'Unit Price',
      validation: {
        min: 0,
      },
    },
    {
      key: 'notes',
      type: 'textarea',
      label: 'Notes',
      validation: {
        maxLength: 1000,
      },
    },
  ],
};

/**
 * SpikeItem Add Form
 */
export const SPIKE_ITEM_ADD_FORM: FormDefinition = {
  ...SPIKE_ITEM_EDIT_FORM,
  id: 'spike-item-add',
  title: 'Add Item',
  mode: 'add',
};

/**
 * Get SpikeItem form definition by mode
 */
export function getSpikeItemFormDefinition(mode: 'edit' | 'add'): FormDefinition {
  return mode === 'add' ? SPIKE_ITEM_ADD_FORM : SPIKE_ITEM_EDIT_FORM;
}
