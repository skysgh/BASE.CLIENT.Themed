import { NAME } from "./t.sites.constants";

import { TBaseConstantsApis } from "../../core/base/constants/t.base.constants.apis";
import { TSitesConstantsApisBrochure } from "./t.sites.constants.apis.brochure";
import { TSitesConstantsApisProducts } from "./t.sites.constants.apis.products";
import { TSitesConstantsApisPricing } from "./t.sites.constants.apis.pricing";
import { TSitesConstantsApisService } from "./t.sites.constants.apis.service";
import { TSitesConstantsApisTodo } from "./t.sites.constants.apis.todo";
import { TSitesConstantsApisPersons } from "./t.sites.constants.apis.persons";


export type TSitesConstantsApis = TBaseConstantsApis & {

  brochure: TSitesConstantsApisBrochure,
  persons: TSitesConstantsApisPersons,
  pricing: TSitesConstantsApisPricing,
  products: TSitesConstantsApisProducts,
  service: TSitesConstantsApisService,
  todo: TSitesConstantsApisTodo

}
