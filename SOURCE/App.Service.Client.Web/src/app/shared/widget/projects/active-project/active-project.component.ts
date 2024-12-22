import { Component, OnInit, Input } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../_BASE/core/modules/common/pipes/basetranslate.pipe';

import { ViewModel } from './vm';

@Component({
  selector: 'app-active-project',
  templateUrl: './active-project.component.html',
  styleUrls: ['./active-project.component.scss']
})

/**
 * Active Project Component
 */
export class ActiveProjectComponent implements OnInit {


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

  constructor() { }

  ngOnInit(): void {
  }

}
