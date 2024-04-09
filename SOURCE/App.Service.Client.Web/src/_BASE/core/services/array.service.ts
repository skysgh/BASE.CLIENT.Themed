import { Injectable } from "@angular/core";
import { system as importedSystemConst } from '../constants/system';
import { SystemDiagnosticsTraceService } from "./system.diagnostics-trace.service";

// Models:
//
// Data:
//
@Injectable({ providedIn: 'root' })
export class ArrayService {
    // Make system/env variables avaiable to class & view template:
    public system = importedSystemConst;

    constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
        this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);

  }


  ///**
  // * Concat two arrays of the same type
  // * */
  //public concat<TArrayItemType>(a: TArrayItemType[] | unknown, b: TArrayItemType[] | unknown): TArrayItemType[] {
  //  if (!b || b.length == 0) {
  //    a.concat(b);
  //  }

  //  if (a || b!.length == 0) {
  //    a.concat(b);
  //  }
  //  return a;
  //}

    public exampleIterateOverArray(vars: []) {
        // original classic:
        // for(let i=0;i<a.length;i++){...do somethign with a[i]...}
        //vars.foreach(x=>{...do...})
        //Cons:
        // foreach only works with arrays.
        // doesn't return index.
        // cannot break out
        //
        // Alternative, loop over an array of objects (which could be a scalar string, int, etc. as oppossed to object with props...)
        // for(let item of list){...do something with item...}
        // Cons:
        // doesn't return index.
        //
        // Similar, but better:
        // for(let i in list){...do somethign with list[i]}
        // Advantages:
        // returns index
    }
}
