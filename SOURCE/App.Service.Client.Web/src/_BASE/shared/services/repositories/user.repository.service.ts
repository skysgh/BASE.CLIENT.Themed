import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../app/core/models/auth.models';
import { SystemService } from '../system.service';
import { System } from '../../constants/contracts/system';

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for system User profiles.
 * Being stateless, ok to have only one instance, so registere in the root:
 */
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

  /**
 * Map incoming TDto to a TVto more appropriate for the UI.
 * TODO: need to use the proper service to do this kind of work.
 * @param dto
 * @returns
 */
  //protected override MapObjectTo(dto: any): any {
  //  //this.objectMappingService.map(dto..., ...);
  //  return ((dto as unknown) as any);
  //}
 // /**
 //* Map TVto back to a TDto more appropriate for saving/updating in a db.
 //* TODO: need to use the proper service to do this kind of work.
 //* @param dto
 //* @returns
 //*/
 // protected override MapObjectFrom(vto: any): any {
 //   //this.objectMappingService.map(dto..., ...);
 //   return ((vto as unknown) as any);
 // }

}
