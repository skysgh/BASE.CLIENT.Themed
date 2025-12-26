import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsSpikesConfigurationNavigation } from "../t.app.lets.spikes.configuration.navigation";

const NAME = 'Spikes';
const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.appletSection, NAME);

export const appletsSpikesConfigurationNavigation : TAppletsSpikesConfigurationNavigation = {

  root: `${NAV_ROOT}`,

  spike: {
    explore: `${NAV_ROOT}spike`,
    create: `${NAV_ROOT}spike`,
    root: `${NAV_ROOT}spike`
  },

  subSpike: {
    explore: `${NAV_ROOT}subSpikes/spike`,
    create: `${NAV_ROOT}subSpikes/spike`,
    root: `${NAV_ROOT}subSpikes/spike`
  }
}

