//import { Component } from '@angular/core';
// Pipes:

//import { TitleService } from '../_BASE/shared/services/title.service';
//import { SystemService } from '../_BASE/shared/services/system.service';
//import { DiagnosticsTraceService } from '../_BASE/shared/services/system.diagnostics-trace.service';


//@Component({
//  selector: 'app-root',
//  templateUrl: './app.component.html',
//  styleUrls: ['./app.component.scss']
//})
///**
// * THe App's root component,
// * initialised by it being defined in
// * AppModule's decorator as
// * the boostrap component
// * 
// * It just creates a route-outlet.
// */
//export class AppComponent {


//  constructor(private diagnosticsTraceService: DiagnosticsTraceService, private titleService: TitleService, systemService: SystemService) {
//    this.diagnosticsTraceService.debug("AppComponent.constructor()")
//    // Set the page's title
//    var pageTitle: string = `${systemService.system.dynamic.sponsor.title}  ${systemService.system.title}`;
//    this.diagnosticsTraceService.debug(`Setting page title: '${pageTitle}'`);
//    this.titleService.set(pageTitle);
//  }
//}
