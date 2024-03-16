import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LanguageService } from '../../_BASE/shared/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Component pages
import { AppLayoutComponent } from './layout.component';
import { VerticalComponent } from './vertical/vertical.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { RightsidebarComponent } from './rightsidebar/rightsidebar.component';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { HorizontalTopbarComponent } from './horizontal-topbar/horizontal-topbar.component';
import { TwoColumnComponent } from './two-column/two-column.component';
import { TwoColumnSidebarComponent } from './two-column-sidebar/two-column-sidebar.component';
import { LangComponent } from './topbar/lang/language.component';


// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';
import { ContextNotificationsComponent } from './topbar/notifications/component';
import { ContextShoppingComponent } from './topbar/shopping/component';
import { ContextHueComponent } from './topbar/hue/component';
import { ContextFullScreenComponent } from './topbar/fullscreen/component';
import { ContextSearchComponent } from './topbar/search/component';
import { ContextUserComponent } from './topbar/user/component';
import { ContextMenuHideComponent } from './topbar/menuhide/component';

@NgModule({
  declarations: [
    AppLayoutComponent,
    VerticalComponent,
    TopbarComponent,
    LangComponent,
    ContextNotificationsComponent,
    ContextShoppingComponent,
    ContextHueComponent,
    ContextFullScreenComponent,
    ContextSearchComponent,
    ContextUserComponent,
    ContextMenuHideComponent,
    SidebarComponent,
    FooterComponent,
    RightsidebarComponent,
    HorizontalComponent,
    HorizontalTopbarComponent,
    TwoColumnComponent,
    TwoColumnSidebarComponent
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
export class LayoutsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
