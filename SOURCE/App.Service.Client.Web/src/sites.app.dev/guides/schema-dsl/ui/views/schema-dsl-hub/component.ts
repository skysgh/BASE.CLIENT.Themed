/**
 * Schema DSL Hub Component
 * 
 * Landing page for Entity Schema DSL documentation.
 * Shows navigation to all documentation articles with descriptions.
 * 
 * Route: /dev/guides/schema-dsl
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Article {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  order: number;
  badge?: string;
  badgeClass?: string;
}

@Component({
  selector: 'app-schema-dsl-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './component.html',
  styles: [`
    .schema-dsl-hub {
      padding: 1.5rem;
      max-width: 1200px;
    }
    
    .article-card {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
    }
    
    .article-card:hover {
      border-color: var(--vz-primary);
      box-shadow: 0 5px 20px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }
    
    .bg-soft-primary {
      background-color: rgba(var(--vz-primary-rgb), 0.15) !important;
    }
    
    .bg-soft-info {
      background-color: rgba(var(--vz-info-rgb), 0.15) !important;
    }
  `]
})
export class SchemaDslHubComponent {
  
  articles: Article[] = [
    {
      id: 'overview',
      title: 'Overview & Concepts',
      description: 'Understanding the Schema DSL architecture, BREAD pattern, and how schema-driven rendering works.',
      icon: 'ri-eye-line',
      route: 'overview',
      order: 1,
      badge: 'Start Here',
      badgeClass: 'bg-success'
    },
    {
      id: 'entity',
      title: 'Entity Definition',
      description: 'Defining fields, data types, lookups, permissions, and data source configuration.',
      icon: 'ri-database-2-line',
      route: 'entity',
      order: 2
    },
    {
      id: 'cards',
      title: 'UniversalCard Mapping',
      description: 'Converting entity data to UniversalCard objects for consistent rendering across views.',
      icon: 'ri-layout-card-line',
      route: 'cards',
      order: 3
    },
    {
      id: 'browse',
      title: 'Browse View Schema',
      description: 'Configuring list views with filters, sorting, pagination, and multiple display modes.',
      icon: 'ri-list-check-2',
      route: 'browse',
      order: 4
    },
    {
      id: 'forms',
      title: 'Form Schemas (Formly)',
      description: 'Building edit, add, and view forms with tabs, groups, validation, and conditional logic.',
      icon: 'ri-file-edit-line',
      route: 'forms',
      order: 5
    },
    {
      id: 'example',
      title: 'Complete Example',
      description: 'A full walkthrough of the Spike entity schema showing all features in action.',
      icon: 'ri-code-s-slash-line',
      route: 'example',
      order: 6,
      badge: 'With Code',
      badgeClass: 'bg-soft-primary text-primary'
    }
  ];
}
