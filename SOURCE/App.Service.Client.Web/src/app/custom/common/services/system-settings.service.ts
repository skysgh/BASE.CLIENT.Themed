// Import dependencies:
import { Injectable } from '@angular/core';

// Describe the service:
@Injectable({ providedIn: 'root' })
export class SystemSettingsService {
  public baseUrl: string = "https:/localhost:1234";
  constructor() {
  }
}
