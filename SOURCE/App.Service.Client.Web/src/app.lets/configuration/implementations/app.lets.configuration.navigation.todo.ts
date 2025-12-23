import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";

const NAME = 'Applets';
const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.root, '');

export const appletsConfigurationNavigationTodo = {


  root: `${NAV_ROOT}education/organisations/`,

  teams: {
    root: `${NAV_ROOT}teams/`,
  },
  messages: {
    root: `${NAV_ROOT}messages/`,
  },
  tasks: {
    root: `${NAV_ROOT}comms/`,
  },
  scheduling: {
    root: `${NAV_ROOT}scheduling/`,
  },
  purchase: {
    root: `${NAV_ROOT}purchase/`,
    checkout: `${NAV_ROOT}purchase/checkout`,
  },
  finance: {
    root: `${NAV_ROOT}finance/`,
  },
  news: {
    root: `${NAV_ROOT}news/`
  },
  reporting: {
    root: `${NAV_ROOT}reporting/`
  },
  misc: {
    todo: `/`
  }

}
