import { HasTenantedEnabledTitleAndDescriptionBase } from "./HasTenantedEnabledTitleAndDescriptionBase";
import { HasTenantedReferenceDataBase } from "./HasTenantedReferenceDataBase";

/**
 * An abstract Base Group.
 * Used by SystemAccount, etc.
 *
 * Implements:
 * 
 * IHasUUID,
 * IHasTenantId,
 * IHasEnabled,
 * IHasTitleAndDescription
 * 
 * Note:
 * Right now it's just a logical unit, not adding
 * properties or methods. But probably requires a GroupType
 * of some kind, defined as a Generic.
 */
export abstract class HasTenantedGroupBase<TGroupType>
  extends HasTenantedEnabledTitleAndDescriptionBase {

  /**
   * The Type of the group
   */
  public type: TGroupType | undefined; 
}

