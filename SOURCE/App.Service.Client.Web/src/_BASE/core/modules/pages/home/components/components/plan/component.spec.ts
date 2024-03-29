import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAppsPagesLandingIndexPlanComponent } from './component';

describe('BaseAppsPagesLandingIndexPlanComponent', () => {
  let component: BaseAppsPagesLandingIndexPlanComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseAppsPagesLandingIndexPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
