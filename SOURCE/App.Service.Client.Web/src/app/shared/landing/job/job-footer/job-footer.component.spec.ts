import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBaseLayoutFooterComponent } from './job-footer.component';

describe('JobBaseLayoutFooterComponent', () => {
  let component: JobBaseLayoutFooterComponent;
  let fixture: ComponentFixture<JobBaseLayoutFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobBaseLayoutFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobBaseLayoutFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
