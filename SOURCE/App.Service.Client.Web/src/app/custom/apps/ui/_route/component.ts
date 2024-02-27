import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";


@Component({
  selector: 'apps-route',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class CustomAppsRouteComponent {

  constructor(private titleService: Title) {
    // Set the desired title for your page
    this.titleService.setTitle("Machine Brains, Inc. BASE");
  }
}
