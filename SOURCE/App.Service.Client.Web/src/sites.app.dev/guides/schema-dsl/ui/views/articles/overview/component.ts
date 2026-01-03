/**
 * Overview Article Component
 * 
 * Introduction to Entity Schema DSL concepts and the BREAD pattern.
 * 
 * Route: /dev/guides/schema-dsl/overview
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-schema-dsl-overview-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './component.html',
  styles: [`
    .article-container {
      padding: 1.5rem;
      max-width: 900px;
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
