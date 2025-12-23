

import { sitesConfigurationNavigation } from "./sites.configuration.navigation";


import { sitesConfigurationOthers } from "./sites.configuration.others";
import { TSitesConfiguration } from "../t.sites.configuration";
import { sitesConstants } from "../../constants/implementations/sites.constants";

const ROOT_SITES = 'Sites'

// Configuration for sites
export const sitesConfiguration : TSitesConfiguration = {

  constants: sitesConstants,


  /**
   * Navigation routes specific to site components.
   */
  navigation: sitesConfigurationNavigation,


  others: sitesConfigurationOthers
}
