import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationAuth } from "../t.themes.t1.configuration.navigation.auth";

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'auth');

export const themesT1ConfigurationNavigationAuth: TThemesT1ConfigurationNavigationAuth =
{
  root: `${NAV_ROOT}`,
  signup: `${NAV_ROOT}signup/basic`,
  signin: `${NAV_ROOT}signin/basic`,
  lockscreen: `${NAV_ROOT}lockscreen/basic`,
  signout: `${NAV_ROOT}signout/`,
  register: `${NAV_ROOT}users/register`,
  login: `${NAV_ROOT}/login`,
}


