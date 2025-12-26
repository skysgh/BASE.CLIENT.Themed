import { NAME } from "../t.sites.constants";

import { TBaseConstantsApis } from "../../../core/base/constants/t.base.constants.apis";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TSitesConstantsApisProducts } from "../t.sites.constants.apis.products";

const API_ROOT =
  StringService.replaceTemplate(
    environment.custom.urls.apis.section,
    NAME).toLowerCase();

export const sitesConstantsApisProducts: TSitesConstantsApisProducts = {
  product: `${API_ROOT}base_service_Products`,
  productTypes: `${API_ROOT}base_service_ProductTypes`,
  productCarts: `${API_ROOT}base_service_ProductCarts`,
}
