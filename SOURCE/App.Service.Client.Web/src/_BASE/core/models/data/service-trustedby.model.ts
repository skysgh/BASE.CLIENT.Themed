import { HasUntenantedEnabledTitleAndDescriptionBase } from "../base/HasUntenantedEnabledTitleAndDescriptionBase";
import { IHasImageName } from "../contracts/IHasImageName";

/** Data model of a known company using or expressing trust in the system.
 *  For use on a sales landing page. 
 */
export class ServiceTrustedBy extends HasUntenantedEnabledTitleAndDescriptionBase
  // As it is uploaded by end users
  // we don't know if we have an icon/image...
      //so we need to record whole fileName
      implements IHasImageName
  //implements IHasEnabled, IHasTitleAndDescription, IHasLanguageCode, IHasImageId
{
    /** name of logo of company. Preferably a scalable svg */
    imageName!: string ;

}

