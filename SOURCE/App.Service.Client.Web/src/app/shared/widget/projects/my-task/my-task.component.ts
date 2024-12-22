import { Component, OnInit, Input } from '@angular/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../_BASE/core/modules/common/pipes/basetranslate.pipe';

import { ViewModel } from './vm';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss']
})

/**
 * MyTask Component
 */
export class MyTaskComponent implements OnInit {


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  // Upcoming Activities
  @Input() MyTask: Array<{
    name?: string;
    dedline?: string;
    status?: string;
    assignee: {
      name?: string;
      profile?: string;
    };
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
