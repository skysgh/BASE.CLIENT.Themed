// Import Ag:
import { Component, OnInit } from '@angular/core';
// Import Common:
import { DiagnosticsService } from '../../../../../../shared/services/diagnostics.service';
// Import Module specific:
// .. Import Services:
import { ArchitectureValuesRepositoryService } from '../../../../services/values-repository.service';
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
    private diagnosticsService: DiagnosticsService,
    private repositoryService: ArchitectureValuesRepositoryService
  ) {
  }

  ngOnInit(): void {
    this.repositoryService
      .getAll()
      .subscribe((x: any) => { this.data = x; });
  }
}
