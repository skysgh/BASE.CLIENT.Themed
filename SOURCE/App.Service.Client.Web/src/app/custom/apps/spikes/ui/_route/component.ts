// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { DiagnosticsService } from '../../../../common/services/diagnostics.service';
// Import Module:


@Component({
  selector: 'app-apps-spikes-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class SpikesRouteComponent implements OnInit {

  constructor(
    private diagnosticsService: DiagnosticsService
  ) {

  }
  ngOnInit(): void {
  }
}
