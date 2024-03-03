import { IHasReferenceData } from "../contracts/IHasReferenceData";
import { HasTitleAndDescriptionBase } from "./HasTitleAndDescription";


export abstract class ReferenceDataBase extends HasTitleAndDescriptionBase implements IHasReferenceData {
    public id?: any;
}
