// Rx:
//
// Ag:
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// Etc:
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Services:
import { SimpleGenericRepositoryServiceBase } from '../../repositories/base/simple-generic-repository-service.base';
import { RepositoryStandardServicesPackage } from "../../repositories/base/_standard-repository-services-package";
// Models:
import { ServiceUserQuote } from "../../../models/data/service-user-quote.model";
import { ServiceLanguagesService } from "../../service.languages.service";

/**
 * Stateless service to manage interactions with
 * an API provided by the service
 * for system user quotes.
 * Being stateless, ok to have only one instance, so registere in the root:
 */

@Injectable({ providedIn: 'root' })
export class ServiceUserEndorsementsRepositoryService
  extends SimpleGenericRepositoryServiceBase<ServiceUserQuote> {
  // Make system/env variables avaiable to class & view template:
  // already defined in superclass: public system = importedSystemConst;

  constructor(
    repositoryStandardServicesPackage: RepositoryStandardServicesPackage,
    private serviceLanguagesService:ServiceLanguagesService,
    httpClient: HttpClient) {
    super(
      repositoryStandardServicesPackage,
      httpClient,
      importedSystemConst.apis.base.service.endorsements
      
    );
  }

  
  public override buildPagedRequestUrl(page:number=0) {
    let result = super.buildPagedRequestUrl(page);

    var languageCode = this.serviceLanguagesService.getLanguage();

    result =
      this.appendMatchInstructions(
        result,
        this.system.storage.db.defaultFieldNames.languageCode,
        languageCode,
        ' ');

    return result;
  }

}
