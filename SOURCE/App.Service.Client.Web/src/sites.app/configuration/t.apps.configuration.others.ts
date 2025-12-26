import { TBaseConfigurationOthers } from "../../core/base/configuration/i.base.configuration.others";

import { appletsConfiguration } from "../../app.lets/configuration/implementations/app.lets.configuration";
import { coreAgConfiguration } from "../../core.ag/configuration/implementations/coreAg.configuration";
import { sitesConfiguration } from "../../sites/configuration/implementation/sites.configuration";
import { themesConfiguration } from "../../themes/configuration/themes.configuration";
import { coreConfiguration } from "../../core/configuration/implementations/core.configuration";
import { TCoreConfiguration } from "../../core/configuration/t.core.configuration";
import { TCoreAgConfiguration } from "../../core.ag/configuration/t.coreAg.configuration";
import { TSitesConfiguration } from "../../sites/configuration/t.sites.configuration";
import { TAppletsConfiguration } from "../../app.lets/configuration/t.app.lets.configuration";

export type TAppsConfigurationOthers = TBaseConfigurationOthers & {
  core: TCoreConfiguration,
  coreAg: TCoreAgConfiguration,
  themes: typeof themesConfiguration,
  sites: TSitesConfiguration,
  //apps: typeof AppsConfiguration,
  applets: TAppletsConfiguration

}
