import { IHasEnabled } from "../../contracts/IHasEnabled";
import { IHasReferenceData } from "../../contracts/IHasReferenceData";
import { IHasTitleAndDescription } from "../../contracts/IHasTitleAndDescription";
import { IHasUUID } from "../../contracts/IHasUUID";
import { HasTitleAndDescriptionBase } from "../../base/HasTitleAndDescriptionBase";


export abstract class ReferenceDataBase extends HasTitleAndDescriptionBase
  implements IHasUUID, IHasEnabled, IHasReferenceData, IHasTitleAndDescription {


    public id?: any;
    /**
     * By default, references are enabled.
     */
    public enabled: boolean = true;
}
