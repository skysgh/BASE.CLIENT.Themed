import { TBaseConfigurationNavigationRoutes } from "../../../core/base/configuration/t.base.configuration.navigation";

export type TAppletsEducationConfigurationNavigation = TBaseConfigurationNavigationRoutes & {

  products: {
    root: string,
    explore: string,
    create: string,
  },
  places: {
    root: string,
  },
  people: {
    root: string,
    all: string,
    learners: string,
    teachers: string,
    caretakers: string,
    administrators: string,
    principals: string, 
    specialists: string, 
    alumni: string,
  },
  enrollments: {
    root: string,
  },
  finances: {
    root: string,
  },
  presence: {
    root: string,
  },
  participation: {
    root: string,
  },
  assessments: {
    root: string,
  },
  progress: {
    root: string,
  },
  accomplishments: {
    root: string,
  }

}
