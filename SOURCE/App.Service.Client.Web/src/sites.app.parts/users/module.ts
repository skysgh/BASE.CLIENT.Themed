import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Views (DI-BREAST-S pattern)
import { UsersDashboardComponent } from './views/dashboard/component';
import { UsersInsightsComponent } from './views/insights/component';
import { UsersImportComponent } from './views/import/component';
import { UsersBrowseComponent } from './views/browse/component';
import { UsersReadComponent } from './views/read/component';
import { UsersEditComponent } from './views/edit/component';
import { UsersAddComponent } from './views/add/component';
import { UsersSettingsComponent } from './views/settings/component';
import { UsersSearchComponent } from './views/search/component';

/**
 * Users Applet Module (Platform Part)
 * 
 * System-level user management.
 * 
 * ROUTES (DI-BREAST-S pattern):
 * - /system/users/           - Dashboard (D)
 * - /system/users/insights   - Insights (I)
 * - /system/users/import     - Import (I)
 * - /system/users/browse     - Browse (B)
 * - /system/users/:id        - Read (R)
 * - /system/users/:id/edit   - Edit (E)
 * - /system/users/add        - Add (A)
 * - /system/users/settings   - Settings (S)
 * - /system/users/search     - Search (S)
 */
@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: UsersDashboardComponent },
      { path: 'insights', component: UsersInsightsComponent },
      { path: 'import', component: UsersImportComponent },
      { path: 'browse', component: UsersBrowseComponent },
      { path: 'add', component: UsersAddComponent },
      { path: 'search', component: UsersSearchComponent },
      { path: 'settings', component: UsersSettingsComponent },
      { path: ':id', component: UsersReadComponent },
      { path: ':id/edit', component: UsersEditComponent },
    ]),
    // Standalone components
    UsersDashboardComponent,
    UsersInsightsComponent,
    UsersImportComponent,
    UsersBrowseComponent,
    UsersReadComponent,
    UsersEditComponent,
    UsersAddComponent,
    UsersSettingsComponent,
    UsersSearchComponent,
  ],
  exports: [RouterModule]
})
export class UsersModule { }
