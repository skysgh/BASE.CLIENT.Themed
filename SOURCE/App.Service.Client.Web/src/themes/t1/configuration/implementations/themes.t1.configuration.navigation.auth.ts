import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationAuth } from "../t.themes.t1.configuration.navigation.auth";

export const NAV_ROOT = StringService.replaceTemplate(environment.custom.urls.navigation.section, 'auth');

export const themesT1ConfigurationNavigationAuth: TThemesT1ConfigurationNavigationAuth =
{
  root: `${NAV_ROOT}`,
  // ✅ FIXED: Modern routes (no /basic or /cover suffix - those are theme reference pages)
  signup: `${NAV_ROOT}signup`,
  signin: `${NAV_ROOT}signin`,
  lockscreen: `${NAV_ROOT}lockscreen/basic`,
  signout: `${NAV_ROOT}logout`,
  register: `${NAV_ROOT}register`,
  login: `${NAV_ROOT}signin`,
}


