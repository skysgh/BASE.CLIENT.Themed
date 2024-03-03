import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";


// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class TitleService {
  constructor(private title: Title) {
    
  }

  public set(text: string) :void {
    this.title.setTitle(text);
  }
}
