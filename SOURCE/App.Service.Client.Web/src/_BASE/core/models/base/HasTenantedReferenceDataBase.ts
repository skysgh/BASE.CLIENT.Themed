import { HasTenantedEnabledTitleAndDescriptionBase } from "./HasTenantedEnabledTitleAndDescriptionBase";

/**
 * Abstract base class for Classification/ReferenceData items.
 *
 * Implements:
 * 
 * IHasUUID,
 * IHasTenantId
 * IHasEnabled,
 * IHasReferenceData
 */
export abstract class HasTenantedReferenceDataBase
  extends HasTenantedEnabledTitleAndDescriptionBase {
}

