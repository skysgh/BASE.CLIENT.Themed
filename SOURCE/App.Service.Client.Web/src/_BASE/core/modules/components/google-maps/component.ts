import { Component, OnInit, Renderer2 } from '@angular/core';
import { SystemService } from '../../../../shared/services/system.service';

@Component({
  selector: 'app-base-common-components-google-maps',
  template: ''
})
export class BaseCoreCommonComponentsGoogleMapsComponent implements OnInit {

  public load: boolean = true;

  constructor(private systemService: SystemService, private renderer: Renderer2) { }

  ngOnInit(): void {
    // Check conditions here to determine whether to load Google Analytics
    const loadAnalytics = true; // Example condition

    if (!this.load) {
      return;
    }
    const script = this.renderer.createElement('script');
      var key = this.systemService.system.keys.GoogleMaps;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      script.async = true;
      script.defer = true;
      this.renderer.appendChild(document.body, script);
    
  }
}
