import { ServiceDeliveryTeamMember } from "../data/service-delivery-team-member.model";
import { HasImageNameBasedUntenantedReferenceDataBase } from "../base/HasImageNameBasedUntenantedReferenceDataBase";


//  {
//    checkboxId: "all-notification-check02",
//    state: false
//  },


/** VTO used to render Team members on a pitch page
 *  See ServiceDeliveryTeamMember
 */
export class ServiceDeliveryTeamMemberVTO extends HasImageNameBasedUntenantedReferenceDataBase {

  public role: string = '';

}
