// Rx:
//
// Ag:
import { Component, OnInit, Input } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
//
// Models:
//
// Data:
//
@Component({
  selector: 'app-base-core-common-components-breadcrumbs',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Bread Crumbs Component
 */
export class BaseCoreCommonComponentsBreadcrumbsComponent implements OnInit {
  // make system/env config accessible by markup:
  system = importedSystemConst;

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
