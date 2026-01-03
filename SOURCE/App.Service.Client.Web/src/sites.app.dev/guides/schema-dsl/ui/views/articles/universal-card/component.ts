/**
 * UniversalCard Mapping Article Component
 * 
 * How to convert entity data to UniversalCard objects for browse view rendering.
 * 
 * Route: /dev/guides/schema-dsl/cards
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-universal-card-article',
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
export class UniversalCardArticleComponent {
  // Code examples stored as component properties to avoid Angular template parsing issues

  readonly rawEntityCode = `{
  "id": "abc123",
  "title": "Evaluate GraphQL",
  "status": "in_progress",
  "priority": "high",
  "assigneeId": "user-5",
  "dueDate": "2024-02-15",
  "createdAt": "2024-01-10"
}`;

  readonly universalCardCode = `{
  "id": "abc123",
  "title": "Evaluate GraphQL",
  "subtitle": "In Progress",
  "description": null,
  "icon": "ri-loader-line",
  "badges": [
    { text: "High", class: "danger" }
  ],
  "metadata": [
    { label: "Due", value: "Feb 15" }
  ],
  "actions": ["edit", "delete"],
  "data": { /* original entity */ }
}`;

  readonly interfaceCode = `interface UniversalCard {
  // Identity
  id: string;                    // Unique identifier
  entityType?: string;           // Entity type (e.g., "spike")
  
  // Display
  title: string;                 // Primary text (from isPrimary field)
  subtitle?: string;             // Secondary text (e.g., status label)
  description?: string;          // Optional description/excerpt
  
  // Visual
  icon?: string;                 // Icon class
  iconColor?: string;            // Icon color
  image?: string;                // Thumbnail URL
  imageAlt?: string;             // Image alt text
  color?: string;                // Card accent color
  
  // Badges
  badges?: CardBadge[];          // Status indicators
  
  // Metadata
  metadata?: CardMetadata[];     // Key-value pairs to display
  
  // Actions
  actions?: string[];            // Available actions
  primaryAction?: string;        // Default action on click
  
  // Selection
  selected?: boolean;            // Is currently selected
  selectable?: boolean;          // Can be selected
  
  // State
  disabled?: boolean;            // Is disabled
  loading?: boolean;             // Is loading
  
  // Original data
  data?: Record<string, unknown>;  // Original entity for reference
}

interface CardBadge {
  text: string;
  class?: string;                // e.g., "primary", "success", "danger"
  icon?: string;
}

interface CardMetadata {
  label: string;
  value: string | number;
  icon?: string;
  type?: 'text' | 'date' | 'user' | 'currency';
}`;

  readonly mappingFunctionCode = `function mapEntityToCard(
  entity: Record<string, unknown>,
  schema: EntitySchema
): UniversalCard {
  // Find primary field
  const primaryField = schema.fields.find(f => f.isPrimary);
  const title = primaryField 
    ? String(entity[primaryField.field] || '') 
    : 'Untitled';
  
  // Get status for subtitle
  const statusField = schema.fields.find(f => f.field === 'status');
  const statusValue = entity['status'] as string;
  const statusOption = statusField?.options?.find(o => o.value === statusValue);
  
  // Build badges from summary fields
  const summaryFields = schema.fields.filter(f => f.summary);
  const badges = summaryFields.map(f => {
    const value = entity[f.field];
    const option = f.options?.find(o => o.value === value);
    return {
      text: option?.label || String(value),
      class: getBadgeClass(f.field, value),
      icon: option?.icon
    };
  }).filter(b => b.text);
  
  // Build metadata from browsable fields
  const metadataFields = schema.fields.filter(
    f => f.browsable && !f.isPrimary && !f.summary
  );
  const metadata = metadataFields.slice(0, 3).map(f => ({
    label: f.label,
    value: formatValue(entity[f.field], f.type),
    icon: getFieldIcon(f)
  }));
  
  return {
    id: String(entity[schema.dataSource.idField || 'id']),
    entityType: schema.id,
    title,
    subtitle: statusOption?.label,
    icon: statusOption?.icon || schema.icon,
    badges,
    metadata,
    actions: getAvailableActions(schema.permissions),
    primaryAction: 'detail',
    data: entity
  };
}`;
}
