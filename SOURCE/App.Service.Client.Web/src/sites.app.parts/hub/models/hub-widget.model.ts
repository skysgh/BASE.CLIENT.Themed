/**
 * Hub Widget Model
 * 
 * Defines the structure for hub widgets.
 */
import { Type } from '@angular/core';

export interface HubWidgetConfig {
  /** Unique identifier */
  id: string;
  
  /** Source applet ID */
  appletId: string;
  
  /** Display title */
  title: string;
  
  /** Icon class */
  icon: string;
  
  /** Widget size */
  size: 'small' | 'medium' | 'large' | 'full';
  
  /** Display order */
  order: number;
  
  /** Is widget enabled? */
  enabled: boolean;
  
  /** Required permission to view */
  permission?: string;
  
  /** Route to navigate on click */
  clickRoute?: string;
  
  /** Widget component (lazy loaded) */
  component?: Type<any>;
}

export interface HubWidgetData {
  /** Primary value to display */
  value: number | string;
  
  /** Label for the value */
  label: string;
  
  /** Change from previous period */
  change?: number;
  
  /** Is change positive? */
  isPositive?: boolean;
  
  /** Subtitle or description */
  subtitle?: string;
  
  /** Additional items to show */
  items?: HubWidgetItem[];
}

export interface HubWidgetItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  badgeVariant?: string;
}
