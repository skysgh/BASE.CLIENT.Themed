// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
// Constants:
//
// Services:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
// Models:
import { StatOneVTO } from '../../../../core/models/view/stat-one.vto';
import { DashboardRepositoryService } from '../services.repositories/service-dashboard.repositoryService';
import { ServiceStat } from '../../../../core/models/data/service-stat.model';
// Data:
// 

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class DashboardService {


  public constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private dashboardRepositoryService: DashboardRepositoryService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    }

  getSummaries() : Observable<StatOneVTO[]>{

    this.diagnosticsTraceService.debug(`${this.constructor.name}.getSummaries()`);

    return of(this.statsData);
  }


  private statsData: StatOneVTO[] = [
    {
      id:'TODO',
      tenancyId: 'TODO',
      enabled: true,
    title: 'Schools',
      description: '...',
      imageId: 'bx bxs-school',
    value: 5871,
    decimalPlaces:0,
    prefix: undefined,
    suffix: undefined,
    changeDirection: +1
    },
    {
      id: 'TODO',
      tenancyId: 'TODO',
    enabled:true,
    title: 'Learners',
    description: '...',
    imageId: 'ri-exchange-dollar-line',
    value: 789.4,
    decimalPlaces: 0,
    prefix: '',
    suffix: 'k',
    changeDirection: +1
    },
    {
      id: 'TODO',
      tenancyId: 'TODO',
      enabled: true,
      title: 'Enrollments',
      description: '',
      imageId: 'bx bx-user-check',
      value: 89.89,
      decimalPlaces: 2,
      prefix: '',
      suffix: '%',
      changeDirection: -1
    },
    {
      id: 'TODO',
      tenancyId: 'TODO',
      enabled:true,
      title: 'Attendance',
      description:'',
      imageId: 'bx bx-bell',
      value: 56.23,
      decimalPlaces: 2,
      prefix: '',
      suffix: '%',
      changeDirection: -1
    },
    {
      id: 'TODO',
      tenancyId: 'TODO',
      enabled: true,
      title: 'Graduating',
      description: '',
      imageId: 'ri-trophy-line',
      value: 2659,
      decimalPlaces: 2,
      prefix: '',
      suffix: '',
      changeDirection: -1
    }
  ];



  //public summariesData: ServiceStat[] = [
  //  {
  //    id: 'TODO',
  //    tenancyId: 'TODO',
  //    enabled:true,
  //    title: 'TOTAL EARNINGS',
  //    description: 'View net earnings',
  //    iconId: 'bx-dollar-circle',
  //    values: [
  //      {
  //        key: "value",
  //        value: "559.25"
  //      },
  //      {
  //        key: "percentage",
  //        "value": '16.24'
  //      },
  //      {
  //        key: "profit",
  //        "value": 'up'
  //      }
  //    ]
  //  },
  //  {
  //    id: 'TODO',
  //    tenancyId: 'TODO',
  //    enabled: true,
  //    title: 'ORDERS',
  //    description: 'View all orders',
  //    iconId: 'bx-shopping-bag',
  //    values: [
  //      { key: "value", value: 36894 },
  //      { key: "persentage", value: 3.57 },
  //      { key: "profit", value: 'down' }
  //    ]
  //  },
  //  {
  //    id: 'TODO',
  //    tenancyId: 'TODO',
  //    enabled: true,
  //    title: 'CUSTOMERS',
  //    description: 'See details',
  //    iconId: 'bx-user-circle',
  //    values: [
  //      { key: "value", value: 183.35 },
  //      { key: "persantage", value: '29.08' },
  //      { key: "profit", value: 'up' },
  //    ]
  //  },
  //  {
  //    id: 'TODO',
  //    tenancyId: 'TODO',
  //    enabled: true,
  //    title: 'MY BALANCE',
  //    description: 'Withdraw money',
  //    iconId: 'bx-wallet',
  //    values: [
  //      { key: "value", value: 165.89 },
  //      { key: "persantage", value: '0.00' },
  //      { key: "profit", value: 'no change' },
  //    ]
  //  }
  //];


}



