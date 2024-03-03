import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Injectable({ providedIn: 'root' })
export class ToastService {

  public constructor(private translate: TranslateService) {
    
  }
//  public translate(textName: string) {
//    this.translate.getTranslation(textName).subscribe(x=>x)
//  }
}
