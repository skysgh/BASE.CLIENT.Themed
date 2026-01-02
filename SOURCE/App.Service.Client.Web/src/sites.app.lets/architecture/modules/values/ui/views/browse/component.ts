// Rx:

// Import Ag:
import { Component, OnInit } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsArchitectureConfiguration } from '../../../../../configuration/implementations/app.lets.architecture.configuration';
// ✅ MIGRATED: Use applet-local Signal-based service
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ArchitectureValueService } from '../../../../../services/architecture-value.service';
// ✅ MIGRATED: Use applet-local ViewModel
import { ArchitectureValueViewModel } from '../../../../../models/view-models/architecture-value.view-model';


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

  // ✅ UPDATED: Use ViewModel type
  public data: ArchitectureValueViewModel[] = [];

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    // ✅ MIGRATED: Use applet-local Signal-based service
    private valueService: ArchitectureValueService
  ) {
  }

  ngOnInit(): void {
    // ✅ UPDATED: Use Signal-based service (data loads automatically in constructor)
    this.data = this.valueService.values();
  }
}
