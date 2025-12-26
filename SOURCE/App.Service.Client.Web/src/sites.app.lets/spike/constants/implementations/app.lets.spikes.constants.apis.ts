import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsSpikesConstantsApis } from "../t.app.lets.spikes.constants.apis";

const NAME = 'Spikes'
const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis.section, NAME);

export const appletsSpikesConstantsApis: TAppletsSpikesConstantsApis =  {

  root: `${API_ROOT}`,

  spike: "apps_spike_Spikes",
  spikes: "apps_spike_Subspikes",

};
