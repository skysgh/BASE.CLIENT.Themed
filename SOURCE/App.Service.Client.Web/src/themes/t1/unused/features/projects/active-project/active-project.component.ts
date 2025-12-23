// Rx:
//
// Ag:
import { Component, OnInit, Input } from '@angular/core';
// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';
// Data:

@Component({
  selector: 'app-active-project',
  templateUrl: './active-project.component.html',
  styleUrls: ['./active-project.component.scss']
})

/**
 * Active Project Component
 */
export class ActiveProjectComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  // Upcoming Activities
  @Input() ActiveProjects: Array<{
    Pname?: string;
    profile?: string;
    Uname?: string;
    progress?: any;
    assignee: Array<{
      profile?: string;
    }>;
    status?: string;
    date?: string;
  }> | undefined;

  constructor(private defaultControllerServices: DefaultComponentServices) { }

  ngOnInit(): void {
  }

}
