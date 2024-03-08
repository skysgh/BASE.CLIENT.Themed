import { ReferenceDataBase } from "./base/ReferenceDataBase";
import { IHasLanguageCode } from "../contracts/IHasLanguageCode";
import { IHasUserFK } from "../contracts/IHasUserFK";




export class UserQuote extends ReferenceDataBase implements IHasUserFK, IHasLanguageCode {

  public userFK: any;

  public languageCode?: string;
}


