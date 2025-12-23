import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsStatComponent } from './analytics-stat.component';

describe('AnalyticsStatComponent', () => {
  let component: AnalyticsStatComponent;
  let fixture: ComponentFixture<AnalyticsStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsStatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
