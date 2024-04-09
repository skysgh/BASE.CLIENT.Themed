import { HasUntenantedEnabledTitleAndDescriptionBase } from "./HasUntenantedEnabledTitleAndDescriptionBase";


/** Abstract base class
 *
 * IMplements:
 * 
 * IHasUUID,
 * IHasEnabled,
 * IHasTitleAndDescription
 */ 
export abstract class HasUntenantedReferenceDataBase
  extends HasUntenantedEnabledTitleAndDescriptionBase {
  //TODO why does this not know Id exists?}
}
