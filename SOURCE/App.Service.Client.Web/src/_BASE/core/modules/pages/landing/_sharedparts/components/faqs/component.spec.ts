import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAppsPagesLandingIndexFaqsComponent } from './component';

describe('BaseAppsPagesLandingIndexFaqsComponent', () => {
  let component: BaseAppsPagesLandingIndexFaqsComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexFaqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseAppsPagesLandingIndexFaqsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexFaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
