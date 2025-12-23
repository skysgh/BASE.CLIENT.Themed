
import { themesT1ConstantsApis } from "./themes.t1.configuration.apis";
import { themesT1ConstantsAssets } from "./themes.t1.constants.assets";
import { TThemesT1Constants } from "../t.themes.t1.constants";
import { environment } from "../../../../environments/environment";
import { themesT1ConstantsResources } from "./themes.t1.constants.resources";

const NAME = 'Themes/T1';

export const themesT1Constants : TThemesT1Constants = {

  id: NAME,

  assets: themesT1ConstantsAssets,

  apis: themesT1ConstantsApis,

  environment: environment,

  resources: themesT1ConstantsResources
};
