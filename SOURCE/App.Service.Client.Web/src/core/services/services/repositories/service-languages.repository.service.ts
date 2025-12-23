//Rx:
import { Observable, catchError, retry } from "rxjs";
//Ag:
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// Constants:

// Services:
//import { MappedGenericRepositoryServiceBase } from "../../repositories/base/mapped-generic-repository.service.base";
import { ServiceSpecificSimpleGenericRepositoryServiceBase } from "../../repositories/base/service-specific-simple-generic-repository.service.base";
import { RepositoryStandardServicesPackage } from "../../repositories/base/_standard-repository-services-package";
// Models/Data:
import { ServiceLanguage } from "../../../models/data/service-language.model";
import { appsConfiguration } from "../../../../apps/configuration/implementations/apps.configuration";
// Constants:

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for System Languages.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class ServiceLanguagesRepositoryService
  extends ServiceSpecificSimpleGenericRepositoryServiceBase<ServiceLanguage> {

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      appsConfiguration.others.sites.constants.apis.service.languages
    );
  }

  // HttpClient API get() method => Fetch entitys list
  public override getPage(page: number = 0): Observable<ServiceLanguage[]> {
    var url = this.buildEnabledPagedRequestUrl(page);
    //Absolutely not: url = this.appendMatchInstructions(url,'languageCode', 'en', '=');
    return this.makeListRequest(url);
  }


}
