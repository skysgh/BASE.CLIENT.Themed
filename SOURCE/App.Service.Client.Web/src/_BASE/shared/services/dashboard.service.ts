// Import dependencies:
import { Injectable } from '@angular/core';
import { Stat } from '../models/stat.model';

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class DashboardService {

  public summaries: Stat[] = [
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


  getSummaries() {
    return this.summaries;
  }
}



