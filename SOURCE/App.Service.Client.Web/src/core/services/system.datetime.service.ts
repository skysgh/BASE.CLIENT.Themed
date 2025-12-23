import { Injectable } from "@angular/core";
import { SystemDefaultServices } from "./system.default-services.service";

@Injectable({ providedIn: 'root' })
export class SystemDatetimeService {

  constructor(private defaultServices: SystemDefaultServices) { }

  /**
   * Returns the current full year.
   * Use cases examples : for copywrite statements.
   * @returns
   */
  public static getYear() {
    return new Date().getFullYear();
  }
}
