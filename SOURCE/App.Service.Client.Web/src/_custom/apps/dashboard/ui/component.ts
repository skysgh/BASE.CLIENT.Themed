import { Component, OnInit } from '@angular/core';
import { DiagnosticsService } from '../../../common/services/diagnostics.service';
import { DashboardService } from '../../../common/services/dashboard.service';
import { Stat } from '../../../common/models/stat.model';



@Component({
  selector: 'apps-dashboard',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class DashboardComponent implements OnInit {

  public summaries: Stat[] = [];
  constructor(private diagnosticsService: DiagnosticsService, private dashboardService: DashboardService) {
  }
  ngOnInit(): void {
    this.diagnosticsService.info("...dashboard in progress...")
    this.summaries = this.dashboardService.getSummaries();
    this.diagnosticsService.info(this.summaries);
    }
}
