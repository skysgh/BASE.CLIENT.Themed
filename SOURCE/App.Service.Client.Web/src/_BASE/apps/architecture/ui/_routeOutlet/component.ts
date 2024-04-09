// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
// Import Module:
// ...

@Component({
  selector: 'app-apps-architecture-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class AppRouteComponent implements OnInit {

  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService
  ) {

  }
  ngOnInit(): void {
  }
}
