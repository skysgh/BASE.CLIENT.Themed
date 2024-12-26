import { IHasImageId } from "../contracts/IHasImageId";
import { HasServiceIdReferenceDataBase } from "./HasServiceIdReferenceDataBase";


/**
 * A ReferenceData item that provides an image as well.
 * 
 * Implements
 * IHasUUID, IHasTenancyId,
 * IHasReferenceData
 * IHasImageId
 */

export abstract class HasImageIdBasedServiceIdReferenceDataBase
    extends HasServiceIdReferenceDataBase
    implements IHasImageId {

    /**
     * Image Identifier (eg: filename *without* extension).
     */
    public imageId: string = '';

}

