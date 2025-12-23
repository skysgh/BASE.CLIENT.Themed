import { NAME } from "../t.sites.constants";

import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TSitesConstantsApis } from "../t.sites.constants.apis";
import { sitesConstantsApisBrochure } from "./sites.constants.apis.brochure";
import { sitesConstantsApisProducts } from "./sites.constants.apis.products";
import { sitesConstantsApisPricing } from "./sites.constants.apis.pricing";
import { sitesConstantsApisTodo } from "./sites.constants.apis.todo";
import { sitesConstantsApisService } from "./sites.constants.apis.service";
import { sitesConstantsApisPersons } from "./sites.constants.apis.persons";

const API_ROOT =
  StringService.replaceTemplate(
    environment.custom.urls.apis.section,
    NAME).toLowerCase();


export const sitesConstantsApis: TSitesConstantsApis = {

  brochure: sitesConstantsApisBrochure,
  persons: sitesConstantsApisPersons,
  pricing: sitesConstantsApisPricing,
  products: sitesConstantsApisProducts,
  service: sitesConstantsApisService,
  todo: sitesConstantsApisTodo

}

