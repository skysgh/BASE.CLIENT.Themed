// Rx:

// Ag:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Misc:
import { NgbTooltipModule, NgbProgressbarModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// 
import { CountUpModule } from 'ngx-countup';
// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';

// NO: Parent Module
// NO: import { BaseThemesV1UnusedFeaturesModule } from '../module';

// Components:
import { ProjectsStatComponent } from './projects-stat/projects-stat.component';
import { ActiveProjectComponent } from './active-project/active-project.component';
import { MyTaskComponent } from './my-task/my-task.component';
import { TeamMembersComponent } from './team-members/team-members.component';


@NgModule({
  declarations: [
    // Components, Directives, Pipes developed in this Module.
    ProjectsStatComponent,
    ActiveProjectComponent,
    MyTaskComponent,
    TeamMembersComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    NgbDropdownModule,
    CountUpModule,
    FeatherModule.pick(allIcons),
    NgApexchartsModule,
    // NO: Import Parent Module:
    // NO: BaseThemesV1UnusedFeaturesModule
    // N/A since unused.
    // Child Modules:
    // N/A
    //
  ],
  exports: [
    // NO: Export Parent Module: (create's circular condition)
    // NO: BaseThemesV1UnusedFeaturesModule,
    // Declared Components:
    ProjectsStatComponent,
    ActiveProjectComponent,
    MyTaskComponent,
    TeamMembersComponent
  ]
})
export class BaseThemesV1UnusedFeatures2ProjectsModule { }
