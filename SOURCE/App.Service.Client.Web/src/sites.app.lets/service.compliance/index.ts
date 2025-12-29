/**
 * Service Compliance Applet
 * 
 * Legal/compliance document management for services.
 * 
 * Features:
 * - Service-level default statements
 * - Per-account statement overrides
 * - Multi-language support
 * - Multiple document formats (PDF, HTML, Markdown)
 * 
 * Exports:
 * - Models (DTOs, ViewModels)
 * - Mappers
 * - Repositories
 * - Services
 */

// Models
export * from './models/dtos';
export * from './models/view-models';

// Mappers
export * from './mappers';

// Repositories
export * from './repositories';

// Services
export * from './services';

// Module
export { ServiceComplianceAppletModule } from './module';
