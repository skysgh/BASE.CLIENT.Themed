import { coreAgConfiguration } from "../../../core.ag/configuration/implementations/coreAg.configuration";
import { themesConfiguration } from "../../../themes/configuration/themes.configuration";
import { TSitesConfigurationOthers } from "../t.sites.configuration.others";

export const sitesConfigurationOthers : TSitesConfigurationOthers = {
  /**
   * Access to theme configuration directly
   * and from there to the assets in CoreAg
   * 
   */
  themes: themesConfiguration,

  /**
   * Access to coreAg configuraiton directly
   */
  coreAg: coreAgConfiguration,

}
