// Rx:
//
// Ag:
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// Etc:
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
// Constants:

// Services:
import { SimpleGenericRepositoryServiceBase } from '../../repositories/base/simple-generic-repository-service.base';
import { RepositoryStandardServicesPackage } from "../../repositories/base/_standard-repository-services-package";
// Models:
import { ServiceUserQuote } from "../../../models/data/service-user-quote.model";
import { ServiceLanguagesService } from "../../service.languages.service";
import { appsConfiguration } from '../../../../sites.app/configuration/implementations/apps.configuration';


/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for system user quotes.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class ServiceUserEndorsementsRepositoryService
  extends SimpleGenericRepositoryServiceBase<ServiceUserQuote> {

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    private serviceLanguagesService:ServiceLanguagesService,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      appsConfiguration.others.sites.constants.apis.brochure.endorsements
      
    );
  }

  
  public override buildPagedRequestUrl(page:number=0) {
    let result = super.buildPagedRequestUrl(page);

    var languageCode = this.serviceLanguagesService.getLanguage();

    result =
      this.appendMatchInstructions(
        result,
        appsConfiguration.others.core.constants.storage.db.columnNames.defaults.languageCode,
        languageCode,
        ' ');

    return result;
  }

}
