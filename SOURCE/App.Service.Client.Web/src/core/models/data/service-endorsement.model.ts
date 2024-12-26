import { HasUntenantedEnabledTitleAndDescriptionBase } from "../base/HasUntenantedEnabledTitleAndDescriptionBase";

export class ServiceEndorsementMAYBE extends HasUntenantedEnabledTitleAndDescriptionBase
  //implements IHasEnabled, IHasTitleAndDescription, IHasLanguageCode, IHasImageId
{
  //public userFK: any;
  public by: string = '';
  public role: string = '';
}

