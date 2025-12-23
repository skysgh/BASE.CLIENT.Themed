import { TBaseConfiguration } from "../../core/base/configuration/t.base.configuration";
import { TSitesConstants } from "../constants/t.sites.constants";
import { TSitesConfigurationNavigation } from "./t.sites.configuration.navigation";
import { TSitesConfigurationOthers } from "./t.sites.configuration.others";


export type TSitesConfiguration = TBaseConfiguration & {

  constants: TSitesConstants,

  navigation: TSitesConfigurationNavigation,

  others: TSitesConfigurationOthers

}
