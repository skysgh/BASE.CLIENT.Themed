/**
 * Icons Reference Module
 * 
 * Near-direct copy from Velzon theme: pages/icons
 * Provides icon library reference pages for developers.
 * 
 * Source: Velzon (Minimal) - icons module
 * 
 * Changes from original:
 * - Removed SharedModule import (breadcrumbs handled differently)
 * - Renamed module to IconsReferenceModule
 * - Updated routing module name
 * - Added DevBreadcrumbsComponent for compatibility
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

// Compatibility shim for breadcrumbs
import { DevBreadcrumbsComponent } from '../../components/breadcrumbs/component';

// Component pages
import { IconsReferenceRoutingModule } from './routing';
import { BoxiconsComponent } from './boxicons/boxicons.component';
import { MaterialdesignComponent } from './materialdesign/materialdesign.component';
import { FeatherComponent } from './feather/feather.component';
import { RemixComponent } from './remix/remix.component';
import { LineawesomeComponent } from './lineawesome/lineawesome.component';
import { IconsCryptoComponent } from './icons-crypto/icons-crypto.component';
import { ToastsContainerallicon } from './toasts-container.component';

@NgModule({
  declarations: [
    BoxiconsComponent,
    MaterialdesignComponent,
    FeatherComponent,
    RemixComponent,
    LineawesomeComponent,
    IconsCryptoComponent,
    ToastsContainerallicon
  ],
  imports: [
    CommonModule,
    NgbToastModule,
    FeatherModule.pick(allIcons),
    IconsReferenceRoutingModule,
    // Breadcrumbs shim for compatibility with Velzon templates
    DevBreadcrumbsComponent,
  ]
})
export class IconsReferenceModule { }
