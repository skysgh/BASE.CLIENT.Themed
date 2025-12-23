import { TBaseConfigurationNavigationRoutes } from "../../../core/base/configuration/t.base.configuration.navigation";


/**
 * Contract/Type for the navigation routes
 * to Settings.
 *
 * The Routes are defined in Themes,
 * because the Layout dropdown provides
 * a link to a View within the list.
 * 
 * While the Views are defined in Sites.
 */
export type TThemesT1ConfigurationNavigationSettings = TBaseConfigurationNavigationRoutes & {

  system: string,

  /** this is wrong. Use Account instead
   * @deprecated
   */
  tenancy: string,

  /** one or more users have roles within an account (e.g. Accountable, Manager, Users)
   * depending on their role (e.g.not User),
   * they can see the accounts
   */
  account: string,

  /**
   * Users have roles within one or more groups
   * with different settings in each.
   */
  group: string,
  /** Users have their own profiles
   * of which there are several (security, preferences, external identities used to login)
   */
  user: string,

}
