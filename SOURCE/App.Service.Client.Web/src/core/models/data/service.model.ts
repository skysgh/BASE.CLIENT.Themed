import { IHasUUID } from "../contracts/IHasUUID";
import { IHasTenancyId } from "../contracts/IHasTenancyId";
import { IHasEnabled } from "../contracts/IHasEnabled";


import { HasUntenantedEnabledTitleAndDescriptionBase } from "../base/HasUntenantedEnabledTitleAndDescriptionBase";

/**
 * Model for a single Service.
 * Note:
 * A DNS endpoint is usually associated with one
 * service. But you can have more than one on
 * the same device & webservice.
 * More than one Tenancy[Profile] can be hosted on the same
 * Service.
 * A Tenancy is the profile of a set of resources
 * routes, rules to access them.
 * Users do not belong to a single Tenancy, and can cross
 * between them (allowing Collaboration between Contractors, etc.)
 *  
 */
export class SystemService extends HasUntenantedEnabledTitleAndDescriptionBase {
  //Thefore has UUID, Enabled, Title, Description
}

/**
 * A single Tenancy within a SystemService.
 * Consider it as Tenancy[Profile] rather than
 * logical boundary (SystemUsers can cross between
 * Tenancies).
 * See SystemAccount, which can relate to one
 * (maybe more in the future?) SystemServiceTenancy
 */
export class SystemServiceTenancy extends HasUntenantedEnabledTitleAndDescriptionBase {
  //Inherits: UUID, Enabled, Title, Description

  /**
   * Foreign Key to SystemService.Id
   */
  public SystemServiceId: string | undefined;
}

/**
 * A System Account is actually a Type of Group.
 * A group has users that have Roles in it.
 */
export class SystemAccountRelationship implements  IHasUUID, IHasTenancyId, IHasEnabled {
  enabled: boolean=true;

  tenancyId!: string;

  id?: string | undefined;
  //Inherits: UUID, Enabled, Title, Description
  /**
   * Foreign Key to SystemAccount.Id this role is managing.
   */
  public SystemAccountId : string | undefined;

/**
 * Foreign Key to SystemRole.Id assigned to SystemUser.Id.
 */
  public SystemRoleId :string | undefined;

  /**
   * Foreign Key to SystemUser.Id
   * who manages the account.
   * TODO: that's wrong. An Account is a Group.
   * A Group has Roles. A SystemUser becomes 
   */
  public SystemUserId : string | undefined;
}


/**
 * A SystemAccount signs up to Subscriptions for Services.
 */
export class SystemAccountSubscription extends HasUntenantedEnabledTitleAndDescriptionBase {
  //Inherits: UUID, Enabled, Title, Description

}
