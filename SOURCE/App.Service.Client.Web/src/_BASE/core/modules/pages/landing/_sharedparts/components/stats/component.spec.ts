import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAppsPagesLandingIndexStatsComponent } from './component';

describe('CounterComponent', () => {
  let component: BaseAppsPagesLandingIndexStatsComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseAppsPagesLandingIndexStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
