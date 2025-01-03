// Ag:
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services:
import { SystemService } from '../../system.service';
// Models/Data:
import { User } from '../../../../core/models/misc/auth.models';

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for system User profiles.
 * Being stateless, ok to have only one instance, so registere in the root:
 */
@Injectable({ providedIn: 'root' })
export class UserProfileService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  constructor(private http: HttpClient, systemService: SystemService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;
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
