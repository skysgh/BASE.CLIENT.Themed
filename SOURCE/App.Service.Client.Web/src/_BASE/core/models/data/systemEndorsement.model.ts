import { HasUntenantedEnabledTitleAndDescriptionBase } from "../base/HasUntenantedEnabledTitleAndDescriptionBase";

export class SystemEndorsement extends HasUntenantedEnabledTitleAndDescriptionBase
  //implements IHasEnabled, IHasTitleAndDescription, IHasLanguageCode, IHasImageId
{
  //public userFK: any;
  public by: string = '';
  public role: string = '';
}

export class SystemFaq extends HasUntenantedEnabledTitleAndDescriptionBase {
  public categoryId: string = '';
}
