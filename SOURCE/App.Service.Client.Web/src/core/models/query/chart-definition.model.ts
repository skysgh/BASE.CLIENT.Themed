/**
 * Chart Definition Models
 * 
 * Defines how to aggregate and render data as charts.
 * Used by BrowseView when chart mode is selected.
 * 
 * Flow:
 * Items[] → ChartDefinition → Aggregation → ChartData → ApexCharts
 */

// ─────────────────────────────────────────────────────────────────────────────
// CHART TYPES
// ─────────────────────────────────────────────────────────────────────────────

/** Supported chart types */
export type ChartType = 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'column';

/** Aggregation methods */
export type AggregationType = 'count' | 'sum' | 'avg' | 'min' | 'max';

// ─────────────────────────────────────────────────────────────────────────────
// CHART DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Defines how to create a chart from data
 * 
 * Example: "Spikes by Category" = count items grouped by category field
 */
export interface ChartDefinition {
  /** Unique identifier */
  id: string;
  
  /** Display label (e.g., "By Category", "Over Time") */
  label: string;
  
  /** Chart type */
  type: ChartType;
  
  /** 
   * Category field (X-axis or segments)
   * The field to group by (e.g., 'category', 'status', 'createdAt')
   */
  categoryField: string;
  
  /** 
   * Category label for display
   */
  categoryLabel?: string;
  
  /**
   * Value field (Y-axis)
   * If omitted, uses count aggregation
   * If provided, aggregates this field (e.g., 'priority', 'amount')
   */
  valueField?: string;
  
  /**
   * Value label for display
   */
  valueLabel?: string;
  
  /**
   * Aggregation method
   * - 'count': Count items per category (default)
   * - 'sum': Sum valueField per category
   * - 'avg': Average valueField per category
   * - 'min'/'max': Min/max valueField per category
   */
  aggregation: AggregationType;
  
  /**
   * For date fields: grouping interval
   */
  dateGrouping?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  
  /**
   * Chart colors (optional, uses theme defaults if not provided)
   */
  colors?: string[];
  
  /**
   * Show data labels on chart
   */
  showDataLabels?: boolean;
  
  /**
   * Icon for chart selector
   */
  icon?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART DATA (Output)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Aggregated data point for charting
 */
export interface ChartDataPoint {
  /** Category label (X-axis or segment label) */
  category: string;
  /** Aggregated value (Y-axis or segment size) */
  value: number;
  /** Original category value (for filtering) */
  rawCategory?: any;
}

/**
 * Chart series data (for multi-series charts)
 */
export interface ChartSeries {
  name: string;
  data: number[];
}

/**
 * Complete chart data ready for rendering
 */
export interface ChartData {
  /** Chart definition used */
  definition: ChartDefinition;
  /** Category labels (X-axis) */
  categories: string[];
  /** Single series data */
  values?: number[];
  /** Multi-series data */
  series?: ChartSeries[];
  /** Total count of items */
  totalCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// AGGREGATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Aggregate items according to chart definition
 */
export function aggregateForChart<T>(
  items: T[],
  definition: ChartDefinition,
  getFieldValue: (item: T, field: string) => any
): ChartData {
  const { categoryField, valueField, aggregation, dateGrouping } = definition;
  
  // Group items by category
  const groups = new Map<string, T[]>();
  
  for (const item of items) {
    let categoryValue = getFieldValue(item, categoryField);
    
    // Handle date grouping
    if (dateGrouping && categoryValue instanceof Date) {
      categoryValue = formatDateGroup(categoryValue, dateGrouping);
    } else if (dateGrouping && typeof categoryValue === 'string') {
      const date = new Date(categoryValue);
      if (!isNaN(date.getTime())) {
        categoryValue = formatDateGroup(date, dateGrouping);
      }
    }
    
    // Convert to string for grouping
    const key = categoryValue?.toString() || '(none)';
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }
  
  // Sort categories
  const sortedCategories = Array.from(groups.keys()).sort();
  
  // Aggregate values
  const values = sortedCategories.map(category => {
    const groupItems = groups.get(category)!;
    return calculateAggregation(groupItems, valueField, aggregation, getFieldValue);
  });
  
  return {
    definition,
    categories: sortedCategories,
    values,
    totalCount: items.length,
  };
}

/**
 * Calculate aggregation for a group
 */
function calculateAggregation<T>(
  items: T[],
  valueField: string | undefined,
  aggregation: AggregationType,
  getFieldValue: (item: T, field: string) => any
): number {
  // Count is always just the length
  if (aggregation === 'count' || !valueField) {
    return items.length;
  }
  
  // Get numeric values
  const numericValues = items
    .map(item => {
      const val = getFieldValue(item, valueField);
      return typeof val === 'number' ? val : parseFloat(val);
    })
    .filter(v => !isNaN(v));
  
  if (numericValues.length === 0) {
    return 0;
  }
  
  switch (aggregation) {
    case 'sum':
      return numericValues.reduce((a, b) => a + b, 0);
    case 'avg':
      return numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
    case 'min':
      return Math.min(...numericValues);
    case 'max':
      return Math.max(...numericValues);
    default:
      return numericValues.length;
  }
}

/**
 * Format date for grouping
 */
function formatDateGroup(date: Date, grouping: 'day' | 'week' | 'month' | 'quarter' | 'year'): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  switch (grouping) {
    case 'day':
      return date.toISOString().split('T')[0];
    case 'week':
      // Get ISO week number
      const weekDate = new Date(date.getTime());
      weekDate.setHours(0, 0, 0, 0);
      weekDate.setDate(weekDate.getDate() + 3 - (weekDate.getDay() + 6) % 7);
      const week1 = new Date(weekDate.getFullYear(), 0, 4);
      const weekNum = 1 + Math.round(((weekDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
      return `${year}-W${weekNum.toString().padStart(2, '0')}`;
    case 'month':
      return `${year}-${(month + 1).toString().padStart(2, '0')}`;
    case 'quarter':
      const quarter = Math.floor(month / 3) + 1;
      return `${year}-Q${quarter}`;
    case 'year':
      return year.toString();
    default:
      return date.toISOString().split('T')[0];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT CHART DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a simple count-by chart definition
 */
export function createCountByChart(
  id: string,
  label: string,
  categoryField: string,
  type: ChartType = 'bar'
): ChartDefinition {
  return {
    id,
    label,
    type,
    categoryField,
    aggregation: 'count',
    showDataLabels: true,
  };
}

/**
 * Create a sum-by chart definition
 */
export function createSumByChart(
  id: string,
  label: string,
  categoryField: string,
  valueField: string,
  type: ChartType = 'bar'
): ChartDefinition {
  return {
    id,
    label,
    type,
    categoryField,
    valueField,
    aggregation: 'sum',
    showDataLabels: true,
  };
}

/**
 * Create a timeline chart definition
 */
export function createTimelineChart(
  id: string,
  label: string,
  dateField: string,
  dateGrouping: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month'
): ChartDefinition {
  return {
    id,
    label,
    type: 'line',
    categoryField: dateField,
    aggregation: 'count',
    dateGrouping,
    showDataLabels: false,
  };
}
