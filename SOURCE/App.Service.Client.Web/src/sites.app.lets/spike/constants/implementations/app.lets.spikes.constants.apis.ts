import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsSpikesConstantsApis } from "../t.app.lets.spikes.constants.apis";

const NAME = 'Spikes'
const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis.section, NAME);

/**
 * API endpoint constants for Spike applet
 * 
 * These are the collection names used with json-server (development)
 * or API paths (production).
 * 
 * Development:
 * - Proxied through /api/rest/* to json-server on port 4202
 * - Collection names map to data.json keys
 * 
 * Production:
 * - Would be actual API paths like /api/spikes, /api/subspikes
 */
export const appletsSpikesConstantsApis: TAppletsSpikesConstantsApis =  {

  root: `${API_ROOT}`,

  /** Spikes collection endpoint */
  spike: "/api/rest/base_system_spike_Spikes",
  
  /** SubSpikes collection endpoint */
  spikes: "/api/rest/base_system_spike_SubSpikes",

};
