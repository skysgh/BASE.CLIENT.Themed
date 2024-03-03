import { Component, OnInit } from '@angular/core';
import { DiagnosticsService } from '../../../shared/services/diagnostics.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { Stat } from '../../../shared/models/stat.model';



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
