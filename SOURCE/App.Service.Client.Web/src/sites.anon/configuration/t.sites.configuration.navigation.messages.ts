import { TBaseConfigurationObject } from "../../core/base/t.base.configuration.object";
import { TThemesT1ConfigurationNavigationMessages } from "../../themes/t1/configuration/t.themes.t1.configuration.navigation.messages";

/**
 * Type for
 * Navigation routes to
 * Messages views.
 *
 * Note: Inherits from Themes T1.
 * because Themes layout frame has a Message Dropdown
 * that in turn provides navigation to one of these
 * routes (although Views are maybe defined here in Sites).
 */
export type TSitesConfigurationNavigationMessages = TThemesT1ConfigurationNavigationMessages & {}



