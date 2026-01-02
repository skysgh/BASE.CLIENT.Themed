import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Component pages
import { AppLayoutComponent } from './layout.component';
import { BaseLayoutVerticalComponent } from './vertical/component';
import { BaseLayoutSidebarComponent } from './sidebar/sidebar.component';
import { BaseLayoutHorizontalComponent } from './horizontal/component';
import { BaseLayoutHorizontalTopbarComponent } from './horizontal-topbar/component';
import { BaseLayoutTwoColumnComponent } from './two-column/two-column.component';
import { BaseLayoutTwoColumnSidebarComponent } from './two-column-sidebar/two-column-sidebar.component';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Top side:
import { BaseLayoutTopBarComponent } from './topbar/topbar.component';
//import { BaseCoreCommonComponentTopBarLanguageComponent } from './topbar/language/component';
import { BaseCoreCommonComponentTopBarNotificationsComponent } from './topbar/notifications/component';
import { BaseCoreCommonComponentTopBarShoppingComponent } from './topbar/shopping/component';
import { BaseCoreCommonComponentTopBarSettingsComponent } from './topbar/settings/component';
import { BaseCoreCommonComponentTopBarHelpComponent } from './topbar/help/component';
import { BaseCoreCommonComponentTopBarHueComponent } from './topbar/hue/component';
import { BaseCoreCommonComponentTopBarFullScreenComponent } from './topbar/fullscreen/component';
import { BaseCoreCommonComponentTopBarSearchComponent } from './topbar/search/component';
import { BaseCoreCommonComponentTopBarUserComponent } from './topbar/user/component';
import { BaseCoreCommonComponentTopBarMenuHideComponent } from './topbar/menuhide/component';
import { BaseCoreCommonComponentTopBarLogoComponent } from './topbar/logo/component';

// Right side:
import { BaseLayoutRightsidebarComponent } from './rightsidebar/component';
import { BaseLayoutRightSideContextThemeCustomiserComponent } from './rightsidebar/theme-customiser/component';

// Standalone topbar components:
import { TopbarTrashComponent } from './topbar/trash/component';

// Footer:
import { BaseLayoutFooterComponent } from './footer/component';
// Parts:
import { BaseCoreCommonComponentTopBarLanguageSelectorComponent } from './components/language/component';
import { BaseCoreCommonComponentsSignUpInComponent } from './components/signupin/component';
import { BaseThemesV1Module } from '../module';
import { BaseThemesModule } from '../../module';
import { BaseThemesV1PipesModule } from '../pipes/module';
import { appsConfiguration } from '../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../configuration/implementations/themes.t1.configuration';

@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    AppLayoutComponent,
    // ...
    BaseLayoutVerticalComponent,
    // TopBar:
    BaseLayoutTopBarComponent,
    //BaseCoreCommonComponentTopBarLanguageComponent,
    BaseCoreCommonComponentTopBarNotificationsComponent,
    BaseCoreCommonComponentTopBarLogoComponent,
    BaseCoreCommonComponentTopBarShoppingComponent,
    BaseCoreCommonComponentTopBarSettingsComponent,
    BaseCoreCommonComponentTopBarHelpComponent,
    BaseCoreCommonComponentTopBarHueComponent,
    BaseCoreCommonComponentTopBarFullScreenComponent,
    BaseCoreCommonComponentTopBarSearchComponent,
    BaseCoreCommonComponentTopBarUserComponent,
    BaseCoreCommonComponentTopBarMenuHideComponent,
    // Right:
    BaseLayoutRightSideContextThemeCustomiserComponent,
    BaseLayoutSidebarComponent,
    // Footer:
    BaseLayoutFooterComponent,
    BaseLayoutRightsidebarComponent,
    BaseLayoutHorizontalComponent,
    BaseLayoutHorizontalTopbarComponent,
    BaseLayoutTwoColumnComponent,
    BaseLayoutTwoColumnSidebarComponent,
    // SubParts:
    BaseCoreCommonComponentTopBarLanguageSelectorComponent,
    BaseCoreCommonComponentsSignUpInComponent
  ],
  imports: [
    // Ag:
    CommonModule,
    RouterModule,
    //Can Remove: TranslateModule.forChild(),
    // Misc:
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    // ✅ FeatherModule with icons - also provided at root AppModule level
    FeatherModule.pick(allIcons),

    // Standalone components:
    TopbarTrashComponent,

    // Import Base:
    //BaseThemesV1Module
    BaseThemesV1PipesModule
  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1Module
    // Declarations:
    BaseCoreCommonComponentTopBarLanguageSelectorComponent,
    BaseCoreCommonComponentsSignUpInComponent,

    BaseThemesV1PipesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow custom web components
})

export class BaseThemesV1ComponentsLayoutsModule {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
