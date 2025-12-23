// Rx:
//
// Ag:
import { Component, OnInit, Input } from '@angular/core';
// Etc:
//
// Configuration:
import { appsConfiguration } from '../../../../../../apps/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Models:
import { ViewModel } from './vm';

@Component({
  selector: 'app-recent-orders',
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.scss']
})
export class RecentOrdersComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

   // Recent Orders data
   @Input() RecentSelling: Array<{
    id?: string;
    image?: string;
    customer?: string;
    product?: string;
    amount?: string;
    vendor?: string;
    status?: string;
    rating?: string;
    average?: string;
  }> | undefined;

  constructor(private defaultControllerServices: DefaultComponentServices) { }

  ngOnInit(): void {
  }

}
