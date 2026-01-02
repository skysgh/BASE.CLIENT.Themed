/**
 * About Module
 * 
 * Platform applet for displaying service information including:
 * - Creator info (developer/owner)
 * - Distributor info (reseller/partner) 
 * - Account info (current organization/tenant)
 * - Version and build information
 * - Open source license attributions
 * 
 * Architecture: Creator → Distributor → Account → User
 * 
 * URL: /system/about
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Core
import { ConfigRegistryService } from '../../core/services/config-registry.service';

// Views
import { AboutHubComponent } from './ui/views/about-hub/component';
import { LicensesComponent } from './ui/views/licenses/component';
import { VersionInfoComponent } from './ui/views/version-info/component';
import { CreatorInfoComponent } from './ui/views/creator-info/component';
import { DistributorInfoComponent } from './ui/views/distributor-info/component';
import { AccountInfoComponent } from './ui/views/account-info/component';

// Constants
import { ABOUT_CONSTANTS } from './constants';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AboutHubComponent },
      { path: 'licenses', component: LicensesComponent },
      { path: 'version', component: VersionInfoComponent },
      { path: 'creator', component: CreatorInfoComponent },
      { path: 'distributor', component: DistributorInfoComponent },
      { path: 'account', component: AccountInfoComponent },
    ]),
    // Standalone components
    AboutHubComponent,
    LicensesComponent,
    VersionInfoComponent,
    CreatorInfoComponent,
    DistributorInfoComponent,
    AccountInfoComponent,
  ],
  exports: [RouterModule]
})
export class AboutModule {
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('applets.about', {
      constants: ABOUT_CONSTANTS
    });
  }
}
