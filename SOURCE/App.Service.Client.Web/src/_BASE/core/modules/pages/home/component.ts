//import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//
import { Component, OnInit } from '@angular/core';
import { System } from '../../../constants/contracts/system';
import { SystemService } from '../../../services/system.service';
import { DiagnosticsTraceService } from '../../../services/diagnostics.service';

@Component({
  selector: 'app-apps-home-home',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsPagesInformationIndexComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  system: System;

  currentSection = 'home';
  showNavigationArrows: any;
  showNavigationIndicators: any;

  constructor(systemService: SystemService, private diagnosticsTraceService: DiagnosticsTraceService, translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

    // Configure breadcrumbs:
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Home', active: true }
    ];
  }





  /**
   * Window scroll method
   */
  // tslint:disable-next-line: typedef
  windowScroll() {
    const navbar = document.getElementById('navbar');
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
      navbar?.classList.add('is-sticky');
    }
    else {
      navbar?.classList.remove('is-sticky');
    }

    // Top Btn Set
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "block"
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "none"
    }
  }

  /**
  * Section changed method
  * @param sectionId specify the current sectionID
  */
  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  /**
   * Toggle navbar
   */
  toggleMenu() {
    document.getElementById('navbarSupportedContent')?.classList.toggle('show');
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

}
