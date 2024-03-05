import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TypeService {
  create<T>(type: (new () => T)): T {
    return new type();
  }
}
