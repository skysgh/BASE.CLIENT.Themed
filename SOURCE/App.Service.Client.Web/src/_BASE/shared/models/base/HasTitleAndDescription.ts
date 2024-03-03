import { IHasReferenceData } from "../contracts/IHasReferenceData";

export abstract class HasTitleAndDescriptionBase implements IHasReferenceData {
    public title!: string;
    public description!: string;
}
