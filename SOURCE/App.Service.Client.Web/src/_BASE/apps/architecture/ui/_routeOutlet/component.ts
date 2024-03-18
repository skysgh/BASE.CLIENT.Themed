// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { DiagnosticsTraceService } from '../../../../shared/services/diagnostics.service';
// Import Module:
// ...

@Component({
  selector: 'app-apps-architecture-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class AppRouteComponent implements OnInit {

  constructor(
    private diagnosticsTraceService: DiagnosticsTraceService
  ) {

  }
  ngOnInit(): void {
  }
}
