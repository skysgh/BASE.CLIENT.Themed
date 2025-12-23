// Ag:
import { Component, OnInit, Output } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';
import { SystemDefaultServices } from '../../../../../../../core/services/system.default-services.service';
import { appsConfiguration } from '../../../../../../../apps/configuration/implementations/apps.configuration';
import { sitesConfiguration } from '../../../../../../configuration/implementation/sites.configuration';
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';

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
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  @Output()
  formSchema : any;

  constructor(
    private defaultControllerServices : DefaultComponentServices) {

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
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
