// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { DiagnosticsService } from '../../../../shared/services/diagnostics.service';
// Import Module:


@Component({
  selector: 'app-base-apps-spikes-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsSpikeRouteOutletComponent implements OnInit {

  constructor(
    private diagnosticsService: DiagnosticsService
  ) {

  }
  ngOnInit(): void {
  }
}
