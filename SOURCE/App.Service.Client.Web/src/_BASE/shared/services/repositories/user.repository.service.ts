import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../app/core/models/auth.models';
import { SystemService } from '../system.service';
import { System } from '../../constants/contracts/system';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  system: System;
  constructor(private http: HttpClient, systemService: SystemService) {

    this.system = systemService.system;

  }
    /***
     * Get All Usera
     */
    getPage() {
        return this.http.get<User[]>(`api/users`);
    }

    /***
     * Facked User Register
     */
  register(user: User) {
      
    return this.http.post(this.system.navigation.auth.register, user);
    }
}
