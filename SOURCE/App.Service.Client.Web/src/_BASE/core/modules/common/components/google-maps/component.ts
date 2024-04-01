// Rx:
//
// Ag:
import { Component, OnInit, Renderer2 } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemService } from '../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../services/diagnostics.service';
// Models:
//
// Data:
//

@Component({
  selector: 'app-base-common-components-google-maps',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentsGoogleMapsComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  system = importedSystemConst;

  public load: boolean = true;

  constructor(
    private systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    private renderer: Renderer2) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
}

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
    // Check conditions here to determine whether to load Google Analytics
    const loadAnalytics = true; // Example condition

    if (!this.load) {
      return;
    }
    const script = this.renderer.createElement('script');
      var key = this.systemService.system.integration.keys.GoogleMaps;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      script.async = true;
      script.defer = true;
      this.renderer.appendChild(document.body, script);
    
  }
}
