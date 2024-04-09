import { HasUntenantedEnabledTitleAndDescriptionBase } from "../base/HasUntenantedEnabledTitleAndDescriptionBase";
import { IHasLanguageCode } from "../contracts/IHasLanguageCode";
import { IHasUserFK } from "../contracts/IHasUserFK";




export class ServiceUserQuote extends HasUntenantedEnabledTitleAndDescriptionBase implements IHasUserFK, IHasLanguageCode {

  public userFK: any;

  public languageCode?: string;
}


