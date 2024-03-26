// Import dependencies:
import { Injectable } from '@angular/core';
import { Stat } from '../models/data/stat.model';
import { DiagnosticsTraceService } from './diagnostics.service';
import { DashboardRepositoryService } from './repositories/dashboard.repositoryService';
import { Observable, of } from 'rxjs';
import { StatOneVTO } from '../models/view/stat-on.vto';

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class DashboardService {

  public constructor(
    private diagnosticsTraceService: DiagnosticsTraceService,
    private dashboardRepositoryService: DashboardRepositoryService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    }

  getSummaries() : Observable<StatOneVTO[]>{
    return of(this.statsData);
  }


  private statsData: StatOneVTO[] = [{
    enabled:true,
    title: 'Schools',
    description:'...',
    value: 5871,
    iconId: 'ri-space-ship-line',
    prefix: undefined,
    changeDirection: +1,
    suffix: undefined,

  }, {
    enabled:true,
    title: 'Learners',
    description: '...',
    value: 789.4,
    iconId: 'ri-exchange-dollar-line',
    changeDirection: +1,
    prefix: '',
    suffix: 'k'

    },
    {
      enabled:true,
    title: 'Enrollments',
    description:'',
      iconId: 'ri-pulse-line',
    value: 89.89,
      changeDirection: -1,
    prefix:'',
    suffix: '%'
    },
    {
      enabled:true,
      title: 'Attendance',
    description:'',
      iconId: 'ri-trophy-line',
      prefix: '',
    value: 56.23,
      suffix: '%',
    changeDirection: -1
  }, {
      enabled: true,
    title: 'ANNUAL DEALS',
      description: '',
      iconId: 'ri-service-line',
      prefix: '',
    value: 2659,
      suffix: '',
      changeDirection: -1,

  }
  ];



  public summariesData: Stat[] = [
    {
      title: 'TOTAL EARNINGS',
      description: 'View net earnings',
      iconId: 'bx-dollar-circle',
      values: [
        {
          key: "value",
          value: "559.25"
        },
        {
          key: "percentage",
          "value": '16.24'
        },
        {
          key: "profit",
          "value": 'up'
        }
      ]
    },
    {
      title: 'ORDERS',
      description: 'View all orders',
      iconId: 'bx-shopping-bag',
      values: [
        { key: "value", value: 36894 },
        { key: "persentage", value: 3.57 },
        { key: "profit", value: 'down' }
      ]
    },
    {
      title: 'CUSTOMERS',
      description: 'See details',
      iconId: 'bx-user-circle',
      values: [
        { key: "value", value: 183.35 },
        { key: "persantage", value: '29.08' },
        { key: "profit", value: 'up' },
      ]
    },
    {
      title: 'MY BALANCE',
      description: 'Withdraw money',
      iconId: 'bx-wallet',
      values: [
        { key: "value", value: 165.89 },
        { key: "persantage", value: '0.00' },
        { key: "profit", value: 'no change' },
      ]
    }
  ];


}



