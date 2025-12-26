// Rx:

// Ag:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { BaseAppsSpikeSubSpikesRepositoryService } from '../../../../services/repositories/subspike-repository.service';
// Models:
import { SubSpike } from '../../../../models/subspike.model';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-subspikes-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSubSpikesBrowseComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsSpikesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // TODO: Move these variables into it:
  public page: number = 1;
  public data?: SubSpike[] = [];

  constructor(
    private route: ActivatedRoute,
    private defaultControllerServices: DefaultComponentServices,
    private repositoryService: BaseAppsSpikeSubSpikesRepositoryService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike:Constructor");
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike:Component OnInit");
    // Load list of elements:
    // TODO page it.


    this.route.params.subscribe(params => {
      this.defaultControllerServices.diagnosticsTraceService.info("params ready2");
      this.defaultControllerServices.diagnosticsTraceService.info('id2: ' + params['id']);
      this.repositoryService.getPageAdChildrenOf(params['id']).subscribe((x:any) => {
        this.defaultControllerServices.diagnosticsTraceService.info('got Y: ' + x.title);
        this.data = x
      });
    });

    //this.route.queryParams.subscribe(queryParams => {
    //  this.diagnosticsTraceService.info("params ready");
    //  this.page = queryParams['page'] | queryParams['pg'] | 1;
    //  this.diagnosticsTraceService.info('page: ' + this.page);
    //  this.repositoryService.getPage(this.page).subscribe((x: any) => {
    //    this.diagnosticsTraceService.info('got X: ' + x);
    //    this.data = x
    //  });
    //});

  }
}
