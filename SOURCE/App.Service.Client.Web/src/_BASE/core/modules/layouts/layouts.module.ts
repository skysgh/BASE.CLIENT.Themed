import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LanguageService } from '../../../shared/services/language.service';
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
import { BaseLayoutHorizontalTopbarComponent } from './horizontal-topbar/horizontal-topbar.component';
import { BaseLayoutTwoColumnComponent } from './two-column/two-column.component';
import { BaseLayoutTwoColumnSidebarComponent } from './two-column-sidebar/two-column-sidebar.component';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Top side:
import { BaseLayoutTopBarComponent } from './topbar/topbar.component';
import { BaseLayoutTopBarContextLanguageComponent } from './topbar/lang/component';
import { BaseLayoutTopBarContextNotificationsComponent } from './topbar/notifications/component';
import { BaseLayoutTopBarContextShoppingComponent } from './topbar/shopping/component';
import { BaseLayoutTopBarContextHueComponent } from './topbar/hue/component';
import { BaseLayoutTopBarContextFullScreenComponent } from './topbar/fullscreen/component';
import { BaseLayoutTopBarContextSearchComponent } from './topbar/search/component';
import { BaseLayoutTopBarContextUserComponent } from './topbar/user/component';
import { BaseLayoutTopBarContextMenuHideComponent } from './topbar/menuhide/component';
import { BaseLayoutTopBarContextLogoComponent } from './topbar/logo/component';

// Right side:
import { BaseLayoutRightsidebarComponent } from './rightsidebar/component';
import { BaseLayoutRightSideContextThemeCustomiserComponent } from './rightsidebar/theme-customiser/component';

// Footer:
import { BaseLayoutFooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppLayoutComponent,
    // ...
    BaseLayoutVerticalComponent,
    // TopBar:
    BaseLayoutTopBarComponent,
    BaseLayoutTopBarContextLanguageComponent,
    BaseLayoutTopBarContextNotificationsComponent,
    BaseLayoutTopBarContextLogoComponent,
    BaseLayoutTopBarContextShoppingComponent,
    BaseLayoutTopBarContextHueComponent,
    BaseLayoutTopBarContextFullScreenComponent,
    BaseLayoutTopBarContextSearchComponent,
    BaseLayoutTopBarContextUserComponent,
    BaseLayoutTopBarContextMenuHideComponent,
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
    TranslateModule,
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    FeatherModule.pick(allIcons),
  ],
  providers: [LanguageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BaseCoreLayoutsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
