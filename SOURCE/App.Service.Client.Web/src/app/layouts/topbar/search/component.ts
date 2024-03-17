import { Component, Inject, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SystemService } from "../../../../_BASE/shared/services/system.service";
import { System } from "../../../../_BASE/shared/constants/contracts/system";
import { EventService } from "../../../../_BASE/shared/services/event.service";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'app-frame-context-search',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseLayoutTopBarContextSearchComponent implements OnInit {

  system: System;

  mode: string | undefined;
  element: any = null; //HTMLElement

  constructor(@Inject(DOCUMENT)
  private document: any,
    systemService: SystemService,
    public translate: TranslateService,
    private eventService: EventService
) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }

  ngOnInit(): void {
    this.element = document.documentElement;
    }

  // Search Topbar
  Search() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
    input = document.getElementById("search-options") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    var inputLength = filter.length;

    if (inputLength > 0) {
      dropdown.classList.add("show");
      searchOptions.classList.remove("d-none");
      var inputVal = input.value.toUpperCase();
      var notifyItem = document.getElementsByClassName("notify-item");

      Array.from(notifyItem).forEach(function (element: any) {
        var notifiTxt = ''
        if (element.querySelector("h6")) {
          var spantext = element.getElementsByTagName("span")[0].innerText.toLowerCase()
          var name = element.querySelector("h6").innerText.toLowerCase()
          if (name.includes(inputVal)) {
            notifiTxt = name
          } else {
            notifiTxt = spantext
          }
        } else if (element.getElementsByTagName("span")) {
          notifiTxt = element.getElementsByTagName("span")[0].innerText.toLowerCase()
        }
        if (notifiTxt)
          element.style.display = notifiTxt.includes(inputVal) ? "block" : "none";

      });
    } else {
      dropdown.classList.remove("show");
      searchOptions.classList.add("d-none");
    }


  }

  /**
 * Search Close Btn
 */
  closeBtn() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var searchInputReponsive = document.getElementById("search-options") as HTMLInputElement;
    dropdown.classList.remove("show");
    searchOptions.classList.add("d-none");
    searchInputReponsive.value = "";
  }

}
