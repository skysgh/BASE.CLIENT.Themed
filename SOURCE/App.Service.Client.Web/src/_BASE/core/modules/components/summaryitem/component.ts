import { Component, Input, OnInit } from "@angular/core";
import { SummaryItem } from "../../../../shared/models/SummaryItem.model";
import { DiagnosticsTraceService } from "../../../../shared/services/diagnostics.service";


@Component({
  selector: 'app-search-summaryitem',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SummaryItemComponent implements OnInit {

  @Input() summaryItem?: SummaryItem; 


  constructor(private diagnosticTraceService: DiagnosticsTraceService) {
    this.diagnosticTraceService.debug(`${this.constructor.name}.construtor()`);
  }

      
    ngOnInit(): void {
      this.diagnosticTraceService.debug(`${this.constructor.name}.onInit()`);
    }
}
