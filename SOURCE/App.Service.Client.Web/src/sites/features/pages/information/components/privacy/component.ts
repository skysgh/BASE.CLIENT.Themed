// Rx:
import { BehaviorSubject, Observable, catchError, filter, map, of, throwError } from 'rxjs';
// Import Ag:
import { Component, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// 
// Configuration:
import { sitesConfiguration } from '../../../../../configuration/implementation/sites.configuration';
import { appsConfiguration } from '../../../../../../apps/configuration/implementations/apps.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
// Model:
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-core-pages-information-privacy-policy',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationPrivacyPolicyComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = sitesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel(appsConfiguration);
  // TODO: Move these variables into it.


  // bread crumb items
  breadCrumbItems!: Array<{}>;

  @Output()
  public markdown$: Observable<string|null> = of(null);

  constructor(
    protected http: HttpClient,
    private defaultControllerServices: DefaultComponentServices
  ) {
    // Make system/env variables avaiable to view template (via singleton or service):
    

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    var url: string = `${this.appsConfiguration.others.sites.constants.resources.open.files.markdown}en/privacy.md`;

    this.getMarkdown(url);

  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
    // Configure breadcrumbs:
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Information' },
      { label: 'Privacy Policy', active: true }
    ];
  }
  

  private getMarkdown(url: string): void {
    this.http.get(url, { responseType: 'text' })
      .pipe(
        map((result: string) => {
          this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.getMarkdown(...)...returned.`);
          // Further process the fetched markdown content here (add translations, etc.)
          return this.processMarkdown(result||'');
        }), catchError(error => {
          // Handle the error here
          this.defaultControllerServices.diagnosticsTraceService.error('Error fetching markdown...');
          // Return a default value or re-throw the error
          return throwError('Failed to fetch markdown');
        }))
      .subscribe((r2: string) => {
        
        if (r2 != null) {
          this.defaultControllerServices.diagnosticsTraceService.debug(`setting $markdown to:\n${r2}`);
          this.markdown$ = of(r2||'');
        }
      }
    );
  }

  private processMarkdown(markdown: string): string {
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.processMarkdown(...)...`);
    // Extract keys wrapped in {{...}} from the markdown content
    var keys :string[] = this.extractKeys(markdown);
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.processMarkdown(...): keys found:${keys.length}`);

    // Replace variables in the markdown content
    var result :string = this.replaceVariables(markdown, keys);

    return result;
  }


  private extractKeys(markdown: string): string[] {
    const regex = /{{(.*?)}}/g;
    const matches = markdown.match(regex);
    if (matches) {
      // Extract keys from matches and remove duplicates
      var keys :string[]= matches.map(match => match.substring(2, match.length - 2).trim());
      return [...new Set(keys)];
    }
    return [];
  }

  private replaceVariables(markdown: string, keys: string[]): string {
    //this.defaultControllerServices.translationService.addLangs(['en']);
    //this.translate.setDefaultLang('en');

    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.replaceVariables(...)`);
    var result :string = markdown;
    // Replace variables in the markdown content
    keys.forEach(key => {
      var value:any
      try {
        value = this.getValueFromObject(this, key);
        value = this.defaultControllerServices.translationService.instant(value);
      } catch {
        value = this.defaultControllerServices.translationService.instant(key);
      }
      if (value !== undefined) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        result = result.replace(regex, value);
      }
    });
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.replaceVariables(...)result: ${result}`);
    return result;
  }

  private getValueFromObject(obj: any, key: string): any {
    // Handle dot notation to access nested properties
    const parts = key.split('.');
    let value = obj;
    for (const part of parts) {
      value = value[part];
      if (value === undefined) {
        break;
      }
    }
    this.defaultControllerServices.diagnosticsTraceService.debug(`${this.constructor.name}.getValueFromObject(...) ${key}:${value}`);
    return value;
  }
}
