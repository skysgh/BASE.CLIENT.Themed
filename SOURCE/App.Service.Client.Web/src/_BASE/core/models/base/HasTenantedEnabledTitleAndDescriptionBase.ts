import { UUIDService } from "../../services/uuidService";
import { IHasEnabled } from "../contracts/IHasEnabled";
import { IHasTenancyId } from "../contracts/IHasTenancyId";
import { IHasTenantedEnabledTitleAndDescription } from "../contracts/IHasTenantedEnabledTitleAndDescription";
import { IHasTenantedReferenceData } from "../contracts/IHasTenantedReferenceData";
import { HasUUIDEntityBase } from "./HasUUIDEntityBase";
import { HasUntenantedEnabledTitleAndDescriptionBase } from "./HasUntenantedEnabledTitleAndDescriptionBase";

/**
 * Contract for entities that have title and description (ie most)
 * but not necessarily a data entry, so leaves it up to implementor
 * to define Id type.
 *
 * Implements:
 * 
 * IHasUUID
 * IHasTenancyId
 * IHasEnabled
 * IHasTitleAndDescription
 */


export abstract class HasTenantedEnabledTitleAndDescriptionBase
  extends HasUUIDEntityBase
  implements IHasTenantedEnabledTitleAndDescription {
    enabled: boolean = true;
    title!: string;
    description!: string;

    /** FK to Tenant.id */
    public tenancyId!: string;



}
