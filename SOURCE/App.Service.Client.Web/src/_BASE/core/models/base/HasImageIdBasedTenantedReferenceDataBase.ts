import { IHasImageId } from "../contracts/IHasImageId";
import { HasTenantedReferenceDataBase } from "./HasTenantedReferenceDataBase";



/**
 * A ReferenceData item that provides an image as well.
 * 
 * Implements
 * IHasUUID, IHasTenancyId,
 * IHasReferenceData
 * IHasImageId
 */
export abstract class HasImageIdBasedTenantedReferenceDataBase
  extends HasTenantedReferenceDataBase
  implements IHasImageId {

    /**
     * Image Identifier (eg: filename *without* extension).
     */
    public imageId: string = '';

}


