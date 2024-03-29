// Ag:
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../../services/diagnostics.service';

@Component({
  selector: 'app-base-core-pages-landing-index-header',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexHeaderComponent implements OnInit {
  // set the current year
  year: number = new Date().getFullYear();
  system = importedSystemConst;

  // CHanging this (by the parent body div wrapper)
  // changes the style of the button.
  @Input()
  sectionId: string = 'home';


  // Event Emitter:
  //@Output()
  //sectionChanged: EventEmitter<string> = new EventEmitter<string>();

  
  
  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translate: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    
  }


  ngOnInit(): void {
    // Noting?
  }


  //Button Event Handler:
  public onToggleMenu() {
    document.getElementById('navbarSupportedContent')?.classList.toggle('show');
  }

  //// EventHandler: for who calls it?
  //onSectionChange(sectionId: string) {
  //  this.section = sectionId;
  //  this.sectionChanged.emit(this.section);
  //}

  // Event handler for window event:
  // tslint:disable-next-line: typedef
  onWindowScroll() {
    const navbar = document.getElementById('navbar');
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
      navbar?.classList.add('is-sticky');
    }
    else {
      navbar?.classList.remove('is-sticky');
    }

 
  }




}
