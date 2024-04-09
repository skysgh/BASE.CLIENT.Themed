import { HasImageNameBasedUntenantedReferenceDataBase } from "../base/HasImageNameBasedUntenantedReferenceDataBase";

/**
 * A db entity model for delivery team members working
 * on a project.
 *
 * TODO: Should a Team member be linked to a Person record
 * to normalise data, rather than add fields here?
 * 
 * See:
 * ServiceDeliveryTeamMemberVTO
 * 
 */
export interface ServiceDeliveryTeamMember extends HasImageNameBasedUntenantedReferenceDataBase {
    role: string;
}
