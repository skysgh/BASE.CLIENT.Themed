import { environment } from "../../../../environments/environment";

import { appletsTemplateConstantsAssets } from "./app.lets.template.constants.assets";
import { appletsTemplateConstantsApis } from "./app.lets.template.constants.apis";
import { TAppletsTemplateConstants } from "../t.app.lets.template.constants";
import { appletsTemplateConstantsResources } from "./app.lets.template.constants.resources";

export const NAME = 'Template';

export const appletsTemplateConstants : TAppletsTemplateConstants = {
  id: NAME,

  apis: appletsTemplateConstantsApis,

  assets: appletsTemplateConstantsAssets,

  environment: environment,

  resources: appletsTemplateConstantsResources
};

