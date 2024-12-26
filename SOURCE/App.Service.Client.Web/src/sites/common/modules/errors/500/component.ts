// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Pipes:
import { BaseTranslatePipe } from '../../../../../core.ui/pipes/basetranslate.pipe';
// Constants:
import { system as importedSystemConst } from '../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../core/services/system.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-errors-500-todo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Page500 Component
 */
export class BaseErrors500TodoComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.
  constructor(private systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via const or service):
    // this.system = systemService.system;
  }

  ngOnInit(): void {
  }

}
