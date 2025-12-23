import { NAME } from '../constants/t.core.constants'

import { TBaseConfiguration } from "../base/configuration/t.base.configuration";
import { TCoreConstants } from "../constants/t.core.constants";
import { TCoreConfigurationNavigation } from "./t.core.configuration.navigation";
import { TCoreIntegrationsEndpoints } from "./t.core.Integrations.endpoints";
import { TCoreIntegrationsKeys } from "./t.core.integrations.keys";


export type TCoreConfiguration = TBaseConfiguration & {

  defaultLanguageCode: string;

  navigation: TCoreConfigurationNavigation

  integrations: {
    endpoints: TCoreIntegrationsEndpoints,
    keys: TCoreIntegrationsKeys
  },

  constants: TCoreConstants
}

