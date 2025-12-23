import { appletsConfiguration } from "../../../app.lets/configuration/implementations/app.lets.configuration";
import { coreAgConfiguration } from "../../../core.ag/configuration/implementations/coreAg.configuration";
import { coreConfiguration } from "../../../core/configuration/implementations/core.configuration";
import { sitesConfiguration } from "../../../sites/configuration/implementation/sites.configuration";
import { themesConfiguration } from "../../../themes/configuration/themes.configuration";
import { themesT1Configuration } from "../../../themes/t1/configuration/implementations/themes.t1.configuration";
import { TAppsConfigurationOthers } from "../t.apps.configuration.others";

export const appsConfigurationOthers: TAppsConfigurationOthers =  {
  core: coreConfiguration,

  coreAg: coreAgConfiguration,

  themes: themesConfiguration,

  sites: sitesConfiguration,

  applets: appletsConfiguration

}
