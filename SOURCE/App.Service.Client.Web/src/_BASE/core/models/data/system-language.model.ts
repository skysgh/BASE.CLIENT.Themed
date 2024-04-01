
import { HasUntenantedReferenceDataBase } from "../base/HasUntenantedReferenceDataBase";
import { IHasImageId } from "../contracts/IHasImageId";
import { IHasLanguageCode } from "../contracts/IHasLanguageCode";
//import { IHasUserFK } from "../contracts/IHasUserFK";

export class SystemLanguage
  extends HasUntenantedReferenceDataBase
  implements
  //ALready has: IHasUUID, IHasEnabled, IHasTitleAndDescription,
  IHasLanguageCode,
  IHasImageId {

  //public userFK: any;
  public languageCode: string = '';

  /**
   * Language flag image filename, without extension.
   */
  public imageId?: string;
}
