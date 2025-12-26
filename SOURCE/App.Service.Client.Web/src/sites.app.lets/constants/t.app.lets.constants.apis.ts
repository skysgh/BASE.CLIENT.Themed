// Import from Core base (framework-agnostic foundation)
// Base types exist in Core, not Core.Ag
import { TBaseConstantsApis } from "../../core/base/constants/t.base.constants.apis";

/**
 * Applets API Constants Type Definition
 * 
 * Purpose:
 * Defines the structure for API endpoint configuration in the app.lets tier.
 * Each applet (education, scheduling, social, etc.) can define its own API endpoints.
 * 
 * Architecture:
 * - Extends TBaseConstantsApis (inherited common API properties from Core)
 * - Currently empty (applets use base APIs only)
 * - Future: Can add applet-specific APIs here
 * 
 * Why This Pattern:
 * 1. **Type Safety**: Catch API configuration errors at compile time
 * 2. **IntelliSense**: Developers get autocomplete for API properties
 * 3. **Extensibility**: Easy to add applet-specific APIs later
 * 4. **Consistency**: All tiers follow same structure (inherit from Core base)
 * 
 * Base Type Location:
 * TBaseConstantsApis is defined in Core (framework-agnostic foundation).
 * All tiers extend this base for consistency.
 * 
 * Single Responsibility:
 * This type ONLY defines the API structure for applets.
 * Implementations are in:
 * @see implementations/app.lets.configuration.apis.ts
 * 
 * Related Types:
 * @see core/base/constants/t.base.constants.apis.ts for base type
 * @see TAppletsConstants for full applets configuration structure
 * @see TAppletsConstantsAssets for asset configuration
 * @see TAppletsConstantsResources for resource configuration
 * 
 * Example Usage:
 * ```typescript
 * // In implementation file:
 * export const appletsConstantsApis: TAppletsConstantsApis = {
 *   // Currently inherits from base, no applet-specific APIs yet
 * };
 * 
 * // In consumer code:
 * const apis: TAppletsConstantsApis = appletsConstantsApis;
 * apis.???  // ← Full IntelliSense for available APIs
 * ```
 * 
 * Future Enhancement Example:
 * ```typescript
 * export type TAppletsConstantsApis = TBaseConstantsApis & {
 *   // Applet-specific APIs could be added here:
 *   education: {
 *     courses: string;      // e.g., "/api/applets/education/courses"
 *     lessons: string;      // e.g., "/api/applets/education/lessons"
 *   };
 *   scheduling: {
 *     events: string;       // e.g., "/api/applets/scheduling/events"
 *     calendar: string;     // e.g., "/api/applets/scheduling/calendar"
 *   };
 * }
 * ```
 * 
 * Note for Junior Developers:
 * - The `&` symbol means "intersection" - this type has ALL properties from
 *   TBaseConstantsApis PLUS any we add here
 * - Currently empty `{}` means we only inherit from base
 * - This is intentional - not all tiers need custom APIs
 * - Having the type defined makes it easy to add APIs later without breaking changes
 * - Base type is in Core (shared across all tiers)
 * 
 * Design Decision:
 * Inheriting from TBaseConstantsApis is NOT over-engineering.
 * Benefits:
 * - DRY (Don't Repeat Yourself): Common structure defined once
 * - Consistency: All tiers have same base structure
 * - Type Safety: Base properties enforced across all tiers
 * - Maintainability: Change base, affects all tiers
 * 
 * @see _custom/documentation/patterns/ROOT-RELATIVE-PATH-pattern.md
 * @see _custom/documentation/standards/CODE-DOCUMENTATION-STANDARDS.md
 * @see core/base/constants/ for all base types
 */
export type TAppletsConstantsApis = TBaseConstantsApis & {
  // Currently no applet-specific APIs
  // Future: Add applet APIs here as needed
}
