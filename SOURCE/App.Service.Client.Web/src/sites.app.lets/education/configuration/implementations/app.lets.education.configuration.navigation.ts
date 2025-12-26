import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsEducationConfigurationNavigation } from "../t.app.lets.education.configuration.navigation";

const NAME = 'Education';
const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.appletSection, NAME);

export const appletsEducationConfigurationNavigation : TAppletsEducationConfigurationNavigation = {

  root: `${NAV_ROOT}`,

  products: {
    root: `${NAV_ROOT}products/`,
    explore: `${NAV_ROOT}products/`,
    create: `${NAV_ROOT}products/`,
  },
  places: {
    root: `${NAV_ROOT}places/`,
  },
  people: {
    root: `${NAV_ROOT}people/`,
    all: `${NAV_ROOT}people/all`,
    learners: `${NAV_ROOT}people/learners`,
    teachers: `${NAV_ROOT}people/teachers/`,
    caretakers: `${NAV_ROOT}people/caretakers/`,
    administrators: `${NAV_ROOT}people/administrators/`,
    principals: `${NAV_ROOT}people/principals/`,
    specialists: `${NAV_ROOT}people/specialists/`,
    alumni: `${NAV_ROOT}people/alumni/`
  },
  enrollments: {
    root: `${NAV_ROOT}enrollment`
  },
  finances: {
    root: `${NAV_ROOT}finances`
  },
  presence: {
    root: `${NAV_ROOT}presence`
  },
  participation: {
    root: `${NAV_ROOT}participation`
  },
  assessments: {
    root: `${NAV_ROOT}assessments`
  },
  progress: {
    root: `${NAV_ROOT}progress`
  },
  accomplishments: {
    root: `${NAV_ROOT}accomplishments`
  }
}

