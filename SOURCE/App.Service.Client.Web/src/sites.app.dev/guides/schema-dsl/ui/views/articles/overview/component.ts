/**
 * Overview Article Component
 * 
 * Introduction to Entity Schema DSL concepts and the BREAD pattern.
 * Uses standard PageHeader for consistent navigation.
 * 
 * Route: /dev/guides/schema-dsl/overview
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../../../../../../sites/ui/widgets/page-header';

@Component({
  selector: 'app-schema-dsl-overview-article',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  templateUrl: './component.html',
  styles: [`
    .article-container {
      padding: 1.5rem;
      max-width: 1000px;
    }
    
    .article-content section {
      scroll-margin-top: 80px;
    }
    
    pre {
      font-size: 12px;
      line-height: 1.4;
    }
  `]
})
export class OverviewArticleComponent { }
