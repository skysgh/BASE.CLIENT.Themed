import { IHasReferenceData } from "../contracts/IHasReferenceData";


export abstract class HasTitleAndDescription implements IHasReferenceData {
    public title!: string;
    public description!: string;
}
