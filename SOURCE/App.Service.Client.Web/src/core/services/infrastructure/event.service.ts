// Rx:
import { Subject, Subscription } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
import { map, filter } from 'rxjs/operators';
// Constants:
import { system as importedSystemConst } from '../../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from '../system.diagnostics-trace.service';

interface Event {
    type: string;
    payload?: any;
}

type EventCallback = (payload: any) => void;

@Injectable({
    providedIn: 'root'
})
export class EventService {

  system = importedSystemConst;

  private handler = new Subject<Event>();
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }

    /**
     * Broadcast the event
     * @param type type of event
     * @param payload payload
     */
  broadcast(type: string, payload = {}) {
    this.diagnosticsTraceService.info(`eventService.broadcast(type:'${type}'', payload:'${payload}')`)
        this.handler.next({ type, payload });
    }

    /**
     * Subscribe to event
     * @param type type of event
     * @param callback call back function
     */
    subscribe(type: string, callback: EventCallback): Subscription {
      this.diagnosticsTraceService.info(`eventService.subscribe(type:'${type}'', callback:'${callback}')`)
        return this.handler.pipe(
            filter(event => event.type === type)).pipe(
                map(event => event.payload))
            .subscribe(callback);
    }
}
