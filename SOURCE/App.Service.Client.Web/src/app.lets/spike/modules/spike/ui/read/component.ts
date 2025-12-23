// Rx:
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../apps/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { BaseAppsSpikeSpikesRepositoryService } from '../../../../services/repositories/spike-repository.service';
// Import Models:
import { Spike } from '../../../../models/spike.model';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-spikes-read',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class BaseAppsSpikeSpikesReadComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsSpikesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // TODO: Move these variables into it:
  public data?: Spike;

  constructor(
    //Observable of the matrix params:
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllServices: DefaultComponentServices,
    private repositoryService: BaseAppsSpikeSpikesRepositoryService,
  ) {
    this.defaultControllServices.diagnosticsTraceService.info("Constructor");
  }


  ngOnInit(): void {
    this.defaultControllServices.diagnosticsTraceService.info("Component OnInit");

    this.route.params.subscribe(params => {
      this.defaultControllServices.diagnosticsTraceService.info(`params ready. id:${params['id']}`);

      this.repositoryService.getSingle(params['id']).subscribe(x => {
        this.defaultControllServices.diagnosticsTraceService.info('got X: ' + x!.title);
        this.data = x!
      });
    });

    //var id = this.route.snapshot.paramMap.get('id')!;

    //this.route.paramMap.pipe(
    //  switchMap((params: ParamMap) => {
    //    var id = params.get('id');
    //    this.data = this.repositoryService.getSingle(params.get('id'));
    //  }
    //);

    
    //var data = this.repositoryService.get(id);



    //var id = params.get('id');

  //  this.data = this.route.paramMap.pipe(
  //    switchMap((params: ParamMap) =>
  //      this.service.getHero(params.get('id')!))
  //  );
  }

  public DoSomething() {
    this.defaultControllServices.diagnosticsTraceService.info("blah");
  }
}
