// Import Ag:
import { Component, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// Import Base.Common.Models:
import { System } from '../../../../../../shared/constants/contracts/system';
// Import Base.Common.Services:
import { SystemService } from '../../../../../../shared/services/system.service';
import { DiagnosticsTraceService } from '../../../../../../shared/services/diagnostics.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, map, of, throwError } from 'rxjs';
import { TranslationService } from '../../../../../../shared/services/translation.service';


@Component({
  selector: 'app-base-core-pages-information-privacy-policy',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationPrivacyPolicyComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  system: System;

  @Output()
  public markdown$: Observable<string|null> = of(null);

  constructor(
    protected http: HttpClient,
    private translateService: TranslateService,
    private systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    private translationService: TranslationService
  ) {

    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    var url: string = `${this.system.sources.assets.markdown}en/privacy.md`;

    this.getMarkdown(url);

  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
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
          // Further process the fetched markdown content here (add translations, etc.)
          return this.processMarkdown(result||'');
        }), catchError(error => {
          // Handle the error here
         this.diagnosticsTraceService.error('Error fetching markdown...');
          // Return a default value or re-throw the error
          return throwError('Failed to fetch markdown');
        }))
      .subscribe((r2: string) => {
        
        if (r2 != null) {
          this.markdown$ = of(r2||'');
        }
      }
    );
  }

  private processMarkdown(markdown: string): string {
    // Extract keys wrapped in {{...}} from the markdown content
    var keys :string[] = this.extractKeys(markdown);

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
    this.translateService.addLangs(['en']);
    this.translateService.setDefaultLang('en');

    // Replace variables in the markdown content
    keys.forEach(key => {
      var value:any
      try {
        value = this.getValueFromObject(this, key);
        value = this.translationService.instant(value);
      } catch {
        value = this.translationService.instant(key);
      }
      if (value !== undefined) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        markdown = markdown.replace(regex, value);
      }
    });
    return markdown;
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
    return value;
  }
}
