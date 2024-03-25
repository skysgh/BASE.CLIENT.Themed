import { ReferenceDataBase } from "./base/ReferenceDataBase";

import { IHasEnabled } from "../contracts/IHasEnabled";
import { IHasTitleAndDescription } from "../contracts/IHasTitleAndDescription";
import { IHasImageName } from "../contracts/IHasImageName";
import { IHasImageId } from "../contracts/IHasImageId";
import { IHasLanguageCode } from "../contracts/IHasLanguageCode";
//import { IHasUserFK } from "../contracts/IHasUserFK";

export class SystemLanguage extends ReferenceDataBase
  implements IHasEnabled, IHasTitleAndDescription, IHasLanguageCode, IHasImageId {
  //public userFK: any;
  public languageCode?: string;
  public imageId?: string;
}
