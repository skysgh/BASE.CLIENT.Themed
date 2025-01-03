// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
// Import Module specific:
// .. Import Services:
import { ArchitectureValuesRepositoryService } from '../../../../services/repositories/values-repository.service';
// ..Import Models:
import { Value } from '../../../../models/value.model';


@Component({
  selector: 'app-base-apps-architecture-values-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsArchitectureValuesBrowseComponent implements OnInit {


  public data?: Value[] = [];

  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private repositoryService: ArchitectureValuesRepositoryService
  ) {
  }

  ngOnInit(): void {
    this.repositoryService
      .getPage()
      .subscribe((x: any) => { this.data = x; });
  }
}
