// Rx:

// Import Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../apps/configuration/implementations/apps.configuration';
import { appletsArchitectureConfiguration } from '../../../../configuration/implementations/app.lets.architecture.configuration';
// .. Import Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { ArchitectureValuesRepositoryService } from '../../../../services/repositories/values-repository.service';
// ..Import Models:
import { Value } from '../../../../models/value.model';


@Component({
  selector: 'app-base-apps-architecture-values-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsArchitectureValuesBrowseComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsArchitectureConfiguration


  public data?: Value[] = [];

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    private repositoryService: ArchitectureValuesRepositoryService
  ) {
  }

  ngOnInit(): void {
    this.repositoryService
      .getPage()
      .subscribe((x: any) => { this.data = x; });
  }
}
