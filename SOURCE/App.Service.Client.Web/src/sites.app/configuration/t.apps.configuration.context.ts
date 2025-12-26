import { TBaseConfiguration } from "../../core/base/configuration/t.base.configuration";
import { TAppsConfigurationContextOrganisation } from "./t.apps.configuration.context.organisation";

/**
 *  Constract to describe the organisations behind the core system's
 * development and distribution.
 */
export type TAppsConfigurationContext = TBaseConfiguration & {

  /**
   * The organisation responsible for the distribution of this commissioned system.
   * Often is - but not always - the same as the sponsor.
   * Note that when distributed, the system's name may be
   * different than the default name. 
   */
  distributor: TAppsConfigurationContextOrganisation;

  /**
   * The sponsor of this system (the organisationt that commissioned it's development).
   */
  sponsor: TAppsConfigurationContextOrganisation;

  /**
   * The developer fo this system.
   * Not necessarily the same organisation oas the sponsor.
   */
  developer: TAppsConfigurationContextOrganisation;
}
