import { Injectable } from '@angular/core';
import { system as importedSystemConst } from '../constants/system';

@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class ServiceTenancyService {
    // Make system/env variables avaiable to class & view template:
    public system = importedSystemConst;

  public id: string ='00000000-0000-0000-0000-000000000001' ;
}
