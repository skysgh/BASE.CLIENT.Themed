import { IHasEnabled } from "../contracts/IHasEnabled";
import { IHasReferenceData } from "../contracts/IHasReferenceData";

/**
 * Contract for entities that have title and description (ie most)
 * but not necessarily a data entry, so doesn't have an Id.
 */
export abstract class HasTitleAndDescriptionBase implements IHasReferenceData {
    public title!: string;
    public description!: string;
}
