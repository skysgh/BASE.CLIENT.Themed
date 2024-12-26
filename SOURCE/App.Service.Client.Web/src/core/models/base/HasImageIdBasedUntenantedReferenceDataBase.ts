import { IHasImageId } from "../contracts/IHasImageId";
import { HasUntenantedReferenceDataBase } from "./HasUntenantedReferenceDataBase";

/**
 * A ReferenceData item that provides an image as well.
 *
 * Implements
 * IHasUUID,
 * IHasReferenceData
 * IHasImageId
 */

export abstract class HasImageIdBasedUntenantedReferenceDataBase
    extends HasUntenantedReferenceDataBase
    implements IHasImageId {

    /**
     * Image Identifier (eg: filename *without* extension).
     */
    public imageId: string = '';

}
