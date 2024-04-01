// Ag:
import { Component, OnInit, Output } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../../services/diagnostics.service';
// Data/Models:
//
// Data:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';

//import { formData as fd } from './form.json';


@Component({
  selector: 'app-base-core-pages-landing-index-contact',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Contact Component
 */
export class BaseAppsPagesLandingIndexContactComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  system = importedSystemConst;
  sectionsInfo = importedSectionsInfo;

  @Output()
  formSchema : any;

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService) {
    // Make system/env variables avaiable to view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }


  ngOnInit(): void {
    //this.formSchema = fd;
  }



//  onSubmit(formData: any) {
//    console.log('Form submitted:', formData);
//  }

//  onCancel() {
//    console.log('Form cancelled');
//  }
}
