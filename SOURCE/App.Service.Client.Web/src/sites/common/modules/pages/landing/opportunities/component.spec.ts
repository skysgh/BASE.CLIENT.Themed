import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCorePagesLandingOpportunitiesComponent } from './component';

describe('JobComponent', () => {
  let component: BaseCorePagesLandingOpportunitiesComponent;
  let fixture: ComponentFixture<BaseCorePagesLandingOpportunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCorePagesLandingOpportunitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseCorePagesLandingOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
