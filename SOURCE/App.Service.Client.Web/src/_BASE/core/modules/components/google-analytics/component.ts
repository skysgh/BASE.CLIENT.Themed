import { Component, OnInit, Renderer2 } from '@angular/core';
import { SystemService } from '../../../../shared/services/system.service';

@Component({
  selector: 'app-base-common-components-google-analytics',
  template: ''
})
export class BaseCoreCommonComponentsGoogleAnalyticsComponent implements OnInit {


  public load: boolean = true;
  
  constructor(private systemService: SystemService, private renderer: Renderer2) { }

  ngOnInit(): void {

    if (!this.load) {
      return;
    }
    const script = this.renderer.createElement('script');
    var key = this.systemService.system.keys.GoogleAnalytics;
    script.src = `https://www.google-analytics.com/analytics.js?key=${key}`;
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(document.body, script);
  }
}
