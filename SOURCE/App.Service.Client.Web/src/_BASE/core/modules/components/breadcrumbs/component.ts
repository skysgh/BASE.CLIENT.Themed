import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-base-core-common-components-breadcrumbs',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Bread Crumbs Component
 */
export class BaseCoreCommonComponentsBreadcrumbsComponent implements OnInit {

  @Input() title: string | undefined;
  @Input() description: string | undefined;

  @Input()
  breadcrumbItems!: Array<{
    active?: boolean;
    label?: string;
  }>;

  constructor() { }

  ngOnInit(): void {
  }

}
