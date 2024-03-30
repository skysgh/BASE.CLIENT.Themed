// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { DiagnosticsTraceService } from './diagnostics.service';
import { DashboardRepositoryService } from './repositories/dashboard.repositoryService';
// Models:
import { Stat } from '../models/data/stat.model';
import { StatOneVTO } from '../models/view/stat-on.vto';
// Data:
// 

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class DashboardService {
  // make system/env config accessible by markup:
  system = importedSystemConst;

  public constructor(
    private diagnosticsTraceService: DiagnosticsTraceService,
    private dashboardRepositoryService: DashboardRepositoryService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    }

  getSummaries() : Observable<StatOneVTO[]>{
    return of(this.statsData);
  }


  private statsData: StatOneVTO[] = [
    {
    enabled:true,
    title: 'Schools',
    description:'...',
    iconId: 'bx bxs-school',
    value: 5871,
    decimalPlaces:0,
    prefix: undefined,
    suffix: undefined,
    changeDirection: +1
    },
    {
    enabled:true,
    title: 'Learners',
    description: '...',
    iconId: 'ri-exchange-dollar-line',
    value: 789.4,
    decimalPlaces: 0,
    prefix: '',
    suffix: 'k',
    changeDirection: +1
    },
    {
      enabled: true,
      title: 'Enrollments',
      description: '',
      iconId: 'bx bx-user-check',
      value: 89.89,
      decimalPlaces: 2,
      prefix: '',
      suffix: '%',
      changeDirection: -1
    },
    {
      enabled:true,
      title: 'Attendance',
      description:'',
      iconId: 'bx bx-bell',
      value: 56.23,
      decimalPlaces: 2,
      prefix: '',
      suffix: '%',
      changeDirection: -1
    },
    {
      enabled: true,
      title: 'Graduating',
      description: '',
      iconId: 'ri-trophy-line',
      value: 2659,
      decimalPlaces: 2,
      prefix: '',
      suffix: '',
      changeDirection: -1
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



