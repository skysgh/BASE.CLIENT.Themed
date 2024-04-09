import { IHasServiceIdEnabledTitleAndDescription } from "../contracts/IHasServiceIdEnabledTitleAndDescription";
import { IHasTenantedEnabledTitleAndDescription } from "../contracts/IHasTenantedEnabledTitleAndDescription";
import { HasUUIDEntityBase } from "./HasUUIDEntityBase";


/**
 * Implements:
 * 
 * IHasUUID,
 * IHasServiceId
 * IHasEnabled
 * IHasTitleAndDescription
 */
export abstract class HasServiceIdEnabledTitleAndDescriptionBase
    extends HasUUIDEntityBase
    implements IHasServiceIdEnabledTitleAndDescription {
    enabled: boolean = true;
    title!: string;
    description!: string;

    /** FK to Tenant.id */
    public serviceId!: string;

}
