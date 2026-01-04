// Ag:
import { Component, OnInit, Output } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Configuration:
// ✅ FIXED: Paths adjusted for new location (_sharedparts/ui/viewsections/contact/)
import { sitesConfiguration } from '../../../../../../../configuration/implementation/sites.configuration';
// Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';
import { SystemDefaultServices } from '../../../../../../../../core/services/system.default-services.service';
import { DefaultComponentServices } from '../../../../../../../../core/services/default-controller-services';

@Component({
    selector: 'app-base-core-pages-landing-index-contact',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * Contact Component
 * 
 * Uses tierConfiguration.context for sponsor/developer contact information
 */
export class BaseAppsPagesLandingIndexContactComponent implements OnInit {
  // ✅ CONVENTION: Expose tier configuration as 'tierConfiguration'
  public tierConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

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
}
