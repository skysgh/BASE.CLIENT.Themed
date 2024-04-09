
import { HasUntenantedReferenceDataBase } from "../base/HasUntenantedReferenceDataBase";
import { IHasImageId } from "../contracts/IHasImageId";
import { IHasLanguageCode } from "../contracts/IHasLanguageCode";
import { IHasServiceId } from "../contracts/IHasServiceId";
//import { IHasUserFK } from "../contracts/IHasUserFK";

/** 
* A datastore record model
* for use with a repository service
* to retrieve a list of languages
* available to a single Service
* irrespective of the sub tenancy.
*
* Part of the process of rendering
* list of available languages on site toolbars.
*/
export class ServiceLanguage
  extends HasUntenantedReferenceDataBase
  implements
  //ALready has: IHasUUID, IHasEnabled, IHasTitleAndDescription,
  IHasServiceId,
  IHasLanguageCode,
  IHasImageId {


  public serviceId!: string ;

  //public userFK: any;
  public languageCode: string = '';

  /**
   * Language flag image filename, without extension.
   */
  public imageId?: string;
}
