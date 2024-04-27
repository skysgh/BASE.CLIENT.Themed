import { Component, OnInit, Input } from '@angular/core';
import { ViewModel } from './vm';

@Component({
  selector: 'app-upcoming-activities',
  templateUrl: './upcoming-activities.component.html',
  styleUrls: ['./upcoming-activities.component.scss']
})

/**
 * Upcoming Activites Component
 */
export class UpcomingActivitiesComponent implements OnInit {

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  // Upcoming Activities
  @Input() UpcomingActivities: Array<{
    date?: string;
    day?: string;
    time?: string;
    content?: string;
    users: Array<{
      name?: string;
      profile?: string;
      variant?: string;
    }>;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
