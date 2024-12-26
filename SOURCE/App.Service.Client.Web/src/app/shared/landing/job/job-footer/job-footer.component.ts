// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Const:
import { system as importedSystemConst } from '../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../../core/services/system.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-job-footer',
  templateUrl: './job-footer.component.html',
  styleUrls: ['./job-footer.component.scss']
})
export class JobBaseLayoutFooterComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  constructor(systemService: SystemService, public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
    
  }

  ngOnInit(): void {
  }

}
