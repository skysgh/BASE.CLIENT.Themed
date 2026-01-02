import { Component, OnInit } from '@angular/core';
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsArchitectureConfiguration } from '../../../../../configuration/implementations/app.lets.architecture.configuration';

// ✅ FIXED: Use local applet service
import { ArchitectureValueService } from '../../../../../services/architecture-value.service';
import { ArchitectureValueViewModel } from '../../../../../models/view-models/architecture-value.view-model';


@Component({
  selector: 'app-base-apps-architecture-value-read',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsArchitectureValuesReadComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsArchitectureConfiguration;

  public data: ArchitectureValueViewModel[] = [];

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private valueService: ArchitectureValueService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("ArchitectureValuesReadComponent");
  }

  ngOnInit(): void {
    this.data = this.valueService.values();
  }
}
