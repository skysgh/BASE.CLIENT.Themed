// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../services/system.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-errors-alt',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * 404 Alt Component
 */
export class BaseErrors404AltComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.
  constructor(systemService: SystemService, public translate: TranslateService) {
  }

  ngOnInit(): void {
  }

}
