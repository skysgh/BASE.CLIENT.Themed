import { ReferenceDataBase } from "./base/ReferenceDataBase";

export class SystemEndorsement extends ReferenceDataBase
  //implements IHasEnabled, IHasTitleAndDescription, IHasLanguageCode, IHasImageId
{
  //public userFK: any;
  public by: string = '';
  public role: string = '';
}
