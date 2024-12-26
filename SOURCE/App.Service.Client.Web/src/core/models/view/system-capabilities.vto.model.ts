

//  {
//    checkboxId: "all-notification-check02",
//    state: false
//  },

import { HasImageIdBasedServiceIdReferenceDataBase } from "../base/HasImageIdBasedServiceIdReferenceDataBase";
import { HasImageIdBasedUntenantedReferenceDataBase } from "../base/HasImageIdBasedUntenantedReferenceDataBase";

/**
 * Note reference to untenanted, rather than serviceId based
 * super class, because it is a VTO that doesn't need it.
 */
export class SystemCapabilitiesVTO extends HasImageIdBasedUntenantedReferenceDataBase {

}


