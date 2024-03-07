import { ReferenceDataBase } from "./base/ReferenceDataBase";

export class SystemLanguage extends ReferenceDataBase {
  public enabled: boolean = true;
  public userFK: any;
  public languageCode?: string;
  public flagImageId?: string;
}
