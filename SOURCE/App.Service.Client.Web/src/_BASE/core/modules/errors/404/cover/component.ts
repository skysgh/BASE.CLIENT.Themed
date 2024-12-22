// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Pipes:
import { BaseTranslatePipe } from '../../../common/pipes/basetranslate.pipe';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
import { SystemService } from '../../../../services/system.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-errors-cover',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * 404 Cover Component
 */
export class BaseErrors404CoverComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.
  constructor(systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
