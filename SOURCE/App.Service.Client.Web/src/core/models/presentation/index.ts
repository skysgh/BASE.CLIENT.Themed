/**
 * Presentation Models
 * 
 * Core models for the Universal Search & Presentation infrastructure.
 * 
 * EXPORTS:
 * - Presentation Profile: Columns, filters, sorting, pagination preferences
 * - Universal Card: The standard card format all entities transform into
 * - Card Broker: Interface + registry for entity → card transformation
 */

// Presentation Profile (how to display data)
export * from './presentation-profile.model';

// Universal Card (standardized card format)
export * from './universal-card.model';

// Card Broker (entity → card transformation)
export * from './card-broker.model';
