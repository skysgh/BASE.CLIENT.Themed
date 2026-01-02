/**
 * Spike Insights View Model
 */
export class ViewModel {
  // View state
  public loading = false;
  public error: string | null = null;
  
  // Selected time range
  public timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all' = 'month';
}
