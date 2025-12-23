// Rx:
// Ag:
import { Injectable } from '@angular/core';
// Etc:
// Constants:
// Services:
import { SystemDefaultServices } from './system.default-services.service';
// Models:
// Data:


/**
 * Stateless OOP Service to facilitate string manipulation.
 */
@Injectable({ providedIn: 'root' })
export class StringService {

  /**
   * Constructor
   * @param defaultServices
   */
  constructor(private defaultServices: SystemDefaultServices) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
  }



  /**
   * Replace a token wrapped in curly brackets in a string with a value.
   *
   * Note: this approach is also used by the custom translation pipe service
   *       provided by this lib.
   * Note: This is a simple string replacement, not a template engine.
   * @param text
   * @param key
   * @param value
   */
  public replaceCurlyBracketsToken(text: string, key: string, value: string): string {
    const token = `{{${key}}}`;
    return text.replace(token, value);

    // TODO: Still Wondering if I should back to look for single {}?
  }



  public capitaliseSentences(text: string, sentenceJoiner:string = ' '): string {
    // Split text into sentences using a regex that captures punctuation.
    const sentences = text.match(/[^.!?]+[.!?]*/g);

    if (!sentences) return text; // If no sentences are found, return original text.

    // Capitalise the first letter of each sentence.
    const capitalisedSentences = sentences.map(sentence => {
      const trimmed = sentence.trim(); // Remove leading/trailing spaces.
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1); // Capitalise first letter.
    });

    // Join sentences back together with a single or double space.
    return capitalisedSentences.join(sentenceJoiner);
  }

  /**
   *  permits the replacement of number arguments
   *
   * "blah blah {0} blah blah {1} blah blah {2}"
   * 
   * @param template
   * @param args
   * @returns
   */
  public static replaceTemplate (template: string, ...args: string[]): string {
    return template.replace(/{(\d+)}/g, (_, index) => args[parseInt(index, 10)] || '');
  }

}
