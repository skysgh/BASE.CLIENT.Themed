import { Injectable, Renderer2 } from "@angular/core";
import { SystemDefaultServices } from "./system.default-services.service";


@Injectable({
  providedIn: 'root',
})
export class RendererService {

  constructor(private defaultServices: SystemDefaultServices, private renderer: Renderer2) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }

  /**
   * Just creates a script element and appends it to the body.
   *
   * Note: Usually called at startup.
   * 
   * @param url
   * @param async
   * @param defer
   */
  public appendScriptElement(url: string, async: boolean = true, defer: boolean = true) {

    const script = this.renderer.createElement('script');

    script.async = async;
    script.defer = defer;

    this.renderer.appendChild(document.body, script);
  }
}
