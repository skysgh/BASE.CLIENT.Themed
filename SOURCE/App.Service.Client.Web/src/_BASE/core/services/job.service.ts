// Rx:
import { Observable } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { JobRepositoryService } from './repositories/job.repository.service';
// Models:
import { Job } from '../models/data/job.model';
// Data:


// Describe the service:
@Injectable({ providedIn: 'root' })
// Injectable service to describe current environment
export class JobService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private jobRepositoryService: JobRepositoryService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }

  public getPage() //: Observable<Job>[]
  {
    this.diagnosticsTraceService.info(`${this.constructor.name}.getPage()`);

    //use the repo
    this.jobRepositoryService.getPage();
  }
}

//import { findjob } from './data';

//// Find Job
//const findjob = [
//  {
//    id: '1',
//    logo: '//assets/_BASE/public/dynamic/userdata/images/companies/img-3.png',
//    name: 'UI/UX designer',
//    comapny: 'Nesta Technologies',
//    location: 'USA',
//    money: '$23k - 35k',
//    skill: ['Design', 'UI/UX', 'Adobe XD'],
//    bookmark: false
//  },
//  {
//    id: '2',
//    logo: '//assets/_BASE/public/dynamic/userdata/images/companies/img-2.png',
//    name: 'Product Sales Specialist',
//    comapny: 'Digitech Galaxy',
//    location: 'Spain',
//    money: '$10k - 15k',
//    skill: ['Sales', 'Product', 'Bussiness'],
//    bookmark: true
//  },
//  {
//    id: '3',
//    logo: '//assets/_BASE/public/dynamic/userdata/images/companies/img-4.png',
//    name: 'Marketing Director',
//    comapny: 'Meta4Systems',
//    location: 'Sweden',
//    money: '$20k - 25k',
//    skill: ['Marketing', 'Bussiness'],
//    bookmark: true
//  },
//  {
//    id: '4',
//    logo: '//assets/_BASE/public/dynamic/userdata/images/companies/img-9.png',
//    name: 'Product Designer',
//    comapny: 'Themesbrand',
//    location: 'USA',
//    money: '$40k+',
//    skill: ['Design', 'UI/UX', 'Adobe XD'],
//    bookmark: false
//  },
//  {
//    id: '5',
//    logo: '//assets/_BASE/public/dynamic/userdata/images/companies/img-1.png',
//    name: 'Project Manager',
//    comapny: 'Syntyce Solutions',
//    location: 'Germany',
//    money: '$18k - 26k',
//    skill: ['HR', 'Manager'],
//    bookmark: false
//  },
//  {
//    id: '6',
//    logo: '//assets/_BASE/public/dynamic/userdata/images/companies/img-7.png',
//    name: 'Business Associate',
//    comapny: 'Nesta Technologies',
//    location: 'USA',
//    money: '$23k - 35k',
//    skill: ['Design', 'UI/UX', 'Adobe XD'],
//    bookmark: true
//  },
//  {
//    id: '7',
//    logo: '//assets/_BASE/public/dynamic/userdata/images/companies/img-8.png',
//    name: 'Recruiting Coordinator',
//    comapny: 'Zoetic Fashion',
//    location: 'Namibia',
//    money: '$12k - 15k',
//    skill: ['Full Time', 'Remote', 'Fashion'],
//    bookmark: true
//  },
//  {
//    id: '8',
//    logo: '//assets/_BASE/public/dynamic/userdata/images/companies/img-5.png',
//    name: 'Customs officer',
//    comapny: 'Nesta Technologies',
//    location: 'USA',
//    money: '$41k - 45k',
//    skill: ['Design', 'UI/UX', 'Adobe XD'],
//    bookmark: false
//  }
//]

//export { findjob }
