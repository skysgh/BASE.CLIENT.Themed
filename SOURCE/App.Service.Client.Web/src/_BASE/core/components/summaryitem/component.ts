import { Component, Input, OnInit } from "@angular/core";
import { SummaryItem } from "../../../shared/models/SummaryItem.model";


@Component({
  selector: 'app-search-summaryitem',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SummaryItemComponent implements OnInit {

  @Input() summaryItem?: SummaryItem; 


  constructor() {

  }

      
    ngOnInit(): void {

    }
}
