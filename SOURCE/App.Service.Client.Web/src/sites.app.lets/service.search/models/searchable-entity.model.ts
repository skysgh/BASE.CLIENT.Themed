/**
 * Searchable Entity Registration
 * 
 * Allows entity types to register themselves as searchable.
 * Each entity provides its own search adapter.
 */

import { SearchQuery, SearchResultItem, SearchFacet } from './search.model';
import { Observable } from 'rxjs';

/**
 * Searchable entity type definition
 */
export interface SearchableEntityType {
  /** Unique identifier for entity type */
  typeId: string;
  /** Display name */
  displayName: string;
  /** Icon class */
  icon: string;
  /** Color (for visual distinction) */
  color: string;
  /** Route prefix for Read view */
  routePrefix: string;
  /** Fields available for filtering */
  filterableFields: SearchableField[];
  /** Fields available for sorting */
  sortableFields: SearchableField[];
}

/**
 * Searchable field definition
 */
export interface SearchableField {
  /** Field key (property path) */
  key: string;
  /** Display label */
  label: string;
  /** Field type (for filter UI) */
  type: 'string' | 'number' | 'date' | 'boolean' | 'enum';
  /** Enum values (if type is 'enum') */
  enumValues?: { value: any; label: string }[];
}

/**
 * Search adapter interface
 * Each searchable entity type implements this
 */
export interface SearchAdapter {
  /** Entity type this adapter handles */
  entityType: SearchableEntityType;
  
  /**
   * Execute search for this entity type
   * @param query Search query
   * @returns Observable of search results for this entity type
   */
  search(query: SearchQuery): Observable<SearchResultItem[]>;
  
  /**
   * Get facets for this entity type
   * @returns Observable of available facets
   */
  getFacets?(): Observable<SearchFacet[]>;
  
  /**
   * Get total count for query
   * @param query Search query
   * @returns Observable of total count
   */
  getCount?(query: SearchQuery): Observable<number>;
}

/**
 * Default searchable entity types (built-in)
 */
export const DEFAULT_SEARCHABLE_TYPES: SearchableEntityType[] = [
  {
    typeId: 'spike',
    displayName: 'Spikes',
    icon: 'bx-bulb',
    color: '#007bff',
    routePrefix: '/apps/spike',
    filterableFields: [
      { key: 'categoryId', label: 'Category', type: 'enum' },
      { key: 'statusId', label: 'Status', type: 'enum' },
      { key: 'priority', label: 'Priority', type: 'number' },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
    ],
    sortableFields: [
      { key: 'title', label: 'Title', type: 'string' },
      { key: 'createdAt', label: 'Created', type: 'date' },
      { key: 'modifiedAt', label: 'Modified', type: 'date' },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
      { key: 'priority', label: 'Priority', type: 'number' },
    ],
  },
];
