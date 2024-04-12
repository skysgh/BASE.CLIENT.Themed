import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAppsPagesLandingIndexReviewComponent } from './component';

describe('BaseAppsPagesLandingIndexReviewComponent', () => {
  let component: BaseAppsPagesLandingIndexReviewComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseAppsPagesLandingIndexReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
