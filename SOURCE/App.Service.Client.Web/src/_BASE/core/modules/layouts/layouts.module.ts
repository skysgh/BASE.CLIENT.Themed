import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { TranslateModule } from '@ngx-translate/core';
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
import { BaseCoreCommonComponentTopBarHueComponent } from './topbar/hue/component';
import { BaseCoreCommonComponentTopBarFullScreenComponent } from './topbar/fullscreen/component';
import { BaseCoreCommonComponentTopBarSearchComponent } from './topbar/search/component';
import { BaseCoreCommonComponentTopBarUserComponent } from './topbar/user/component';
import { BaseCoreCommonComponentTopBarMenuHideComponent } from './topbar/menuhide/component';
import { BaseCoreCommonComponentTopBarLogoComponent } from './topbar/logo/component';

// Right side:
import { BaseLayoutRightsidebarComponent } from './rightsidebar/component';
import { BaseLayoutRightSideContextThemeCustomiserComponent } from './rightsidebar/theme-customiser/component';

// Footer:
import { BaseLayoutFooterComponent } from './footer/component';
import { BaseCoreCommonComponentsModule } from '../common/components/module';
import { ServiceLanguagesService } from '../../services/service.languages.service';

@NgModule({
  declarations: [
    AppLayoutComponent,
    // ...
    BaseLayoutVerticalComponent,
    // TopBar:
    BaseLayoutTopBarComponent,
    //BaseCoreCommonComponentTopBarLanguageComponent,
    BaseCoreCommonComponentTopBarNotificationsComponent,
    BaseCoreCommonComponentTopBarLogoComponent,
    BaseCoreCommonComponentTopBarShoppingComponent,
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
    BaseLayoutTwoColumnSidebarComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    BaseCoreCommonComponentsModule,
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    FeatherModule.pick(allIcons),
  ],
  providers: [ServiceLanguagesService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BaseCoreLayoutsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
