// Ag:
import { Component, OnInit, Input } from '@angular/core';
// Etc:
// 
// Const:
import { system as importedSystemConst } from '../../../../../_BASE/core/constants/system';
// Services:
import { SystemService } from '../../../../../_BASE/core/services/system.service';
// Models/Data:
import { ChartTypeVTO } from '../../../../../_BASE/core/models/view/chart-type.vto.model';
import { status1, status2, status3, status4, status5, status6, status7 } from './data';
import { ViewModel } from './vm';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})

/**
 * Team Members Component
 */
export class TeamMembersComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  // Team Members
  @Input() TeamMembers: Array<{
    name?: string;
    dedline?: string;
    status?: string;
    assignee: {
      name?: string;
      profile?: string;
    };
  }> | undefined;

  status1!: ChartTypeVTO;
  status2!: ChartTypeVTO;
  status3!: ChartTypeVTO;
  status4!: ChartTypeVTO;
  status5!: ChartTypeVTO;
  status6!: ChartTypeVTO;
  status7!: ChartTypeVTO;

  constructor(private systemService: SystemService) {
    // Make system/env variables avaiable to view template:
    // system = importedSystemConst;
  }

  ngOnInit(): void {
    /**
     * Fetches the data
     */
     this.fetchData();
   
  }

   /**
   * Fetches the data
   */
    private fetchData() {
      this.status1 = status1;
      this.status2 = status2;
      this.status3 = status3;
      this.status4 = status4;
      this.status5 = status5;
      this.status6 = status6;
      this.status7 = status7;
    }

}
