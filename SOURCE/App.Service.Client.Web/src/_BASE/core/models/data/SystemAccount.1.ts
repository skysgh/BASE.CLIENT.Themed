import { HasGroupBase } from "./base/HasGroupBase.1";

/**
 * A system account has  a 1:1 relationship
 * with a Tenancy.
 * It is the Group that manages a Tenancy.
 * It can have multiple Roles (ie Persons)
 * managing the Tenancy.
 */


export class SystemAccount extends HasGroupBase {
    //Inherits: UUID, Enabled, Title, Description
    /**
    * Foreign Key to SystemServiceTenancy.Id
    * TODO: May in future convert from 1:* relationship
    * to a Join table if that becomes a valid use case.
    */
    public SystemTenancyId: string | undefined;
}
