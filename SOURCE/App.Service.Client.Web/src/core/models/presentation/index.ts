/**
 * Presentation Models
 * 
 * Core models for the Universal Search & Presentation infrastructure.
 * 
 * EXPORTS:
 * - Presentation Profile: Columns, filters, sorting, pagination preferences
 * - Universal Card: The standard card format all entities transform into
 * - Universal Tile: Extension of card for hub tiles with navigation
 * - Card Broker: Interface + registry for entity → card transformation
 * - Reference Item: Rich dropdown/selector item with card display
 */

// Presentation Profile (how to display data)
export * from './presentation-profile.model';

// Universal Card (standardized card format)
export * from './universal-card.model';

// Universal Tile (hub tiles with navigation)
export * from './universal-tile.model';

// Card Broker (entity → card transformation)
export * from './card-broker.model';

// Reference Item (rich selector item)
export * from './reference-item.model';
