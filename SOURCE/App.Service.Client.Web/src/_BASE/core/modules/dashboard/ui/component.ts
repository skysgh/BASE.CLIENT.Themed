import { Component, OnInit } from '@angular/core';
import { DiagnosticsTraceService } from '../../../services/diagnostics.service';
import { DashboardService } from '../../../services/dashboard.service';
import { Stat } from '../../../models/data/stat.model';



@Component({
  selector: 'apps-dashboard',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class DashboardComponent implements OnInit {

  public summaries: Stat[] = [];
  constructor(private diagnosticsTraceService: DiagnosticsTraceService, private dashboardService: DashboardService) {
  }
  ngOnInit(): void {
    this.diagnosticsTraceService.info("...dashboard in progress...")
    this.summaries = this.dashboardService.getSummaries();
    this.diagnosticsTraceService.info(this.summaries);
    }
}
