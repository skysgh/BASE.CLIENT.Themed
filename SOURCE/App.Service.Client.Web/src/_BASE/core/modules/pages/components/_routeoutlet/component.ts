// Import Ag:
import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Import Common:
import { DiagnosticsTraceService } from '../../../../services/diagnostics.service';
// Import Module:


@Component({
  selector: 'app-base-core-pages-route-outlet',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseCorePagesROComponent implements OnInit {

  constructor(
    private diagnosticsTraceService: DiagnosticsTraceService
  ) {

  }
  ngOnInit(): void {
  }
}
