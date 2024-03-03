// Import dependencies:
import { Injectable } from '@angular/core';

// Describe the service:
@Injectable({ providedIn: 'root' })

  // Injectable service to describe sponsor organisation
  // (ie service provider who funded the development by a developer)
export class SponsorService {
  private title: string = "Some Corp";  
  constructor(){
  }
}
