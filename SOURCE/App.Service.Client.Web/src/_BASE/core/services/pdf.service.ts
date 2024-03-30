// Rx:
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
// Ag:
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Etc:
import { PDFDocument } from 'pdf-lib';
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { DiagnosticsTraceService } from './diagnostics.service';
// Models:
//
// Unknown:
import { Search } from 'angular-feather/icons';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient,
    private diagnosticsTraceService: DiagnosticsTraceService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }
  public fetchAndReplacePdfTokens(
    pdfUrl: string,
    replacements: { [key: string]: string }|undefined,
    useBrackets :boolean = true): Observable<string> {

    const encodingType:string = 'utf-8';

    return this.http.get(pdfUrl, { responseType: 'arraybuffer' }).pipe(
      switchMap((pdfData: ArrayBuffer) => {
        // Convert ArrayBuffer to string
        const pdfText = new TextDecoder(encodingType).decode(pdfData);

        // Perform search and replace for tokens
        let modifiedPdfText = pdfText;

        for (const token in replacements) {
          if (replacements.hasOwnProperty(token)) {
            //Searches for tokens wrapped in {{...}}
            var searchTerm: string = (useBrackets) ? `\\{\\{${token}\\}\\}` : `${token}`;

            modifiedPdfText =
              modifiedPdfText
                .replace(new RegExp(searchTerm, 'g'),
                  replacements[token]);
          }
        }

        // Convert modified text back to ArrayBuffer
        const modifiedPdfData = new TextEncoder().encode(modifiedPdfText);

        // Create a Blob from ArrayBuffer
        const blob = new Blob([modifiedPdfData], { type: 'application/pdf' });

        // Create URL object from Blob
        const url = URL.createObjectURL(blob);

        return of(url);
      })
    );
  }
}
