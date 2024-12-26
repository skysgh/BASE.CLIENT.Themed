/**
 * Contract for models associated to a
 * single system User.
 *
 * WARNING:
 * in general, Ownership is a poor value
 * pattern to adhere to: things don't actually
 * belong to people directly, instead they
 * belong to a Group (eg: estate)
 * within which a person has a Role.
 * THe role can be Owner/manager/AttorneyPrivilege,etc.
 * and passed through multiple generations.
 */
export interface IHasUserFK {

  /**
   * FK to the id of a SystemUser entity.
   */
  userFK: any;
}

