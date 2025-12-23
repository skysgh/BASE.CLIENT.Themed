import { themesT1ConfigurationNavigationLandings, NAV_ROOT } from "../../../themes/t1/configuration/implementations/themes.t1.configuration.navigation.landings";
import { TSitesConfigurationNavigationLandings } from "../t.sites.configuration.navigation.landings";

export { NAV_ROOT }

export const sitesConfigurationNavigationLandings: TSitesConfigurationNavigationLandings = {
  ...themesT1ConfigurationNavigationLandings,
  //default: `${NAV_ROOT}default`,

  index: `${NAV_ROOT}index`,
  comingSoon: `${NAV_ROOT}coming-soon`,
  faqs: `${NAV_ROOT}faqs`,
  pricing: `${NAV_ROOT}pricing`,
  maintenance: `${NAV_ROOT}maintenance`,
  opportunities: `${NAV_ROOT}opportunities`,
};
