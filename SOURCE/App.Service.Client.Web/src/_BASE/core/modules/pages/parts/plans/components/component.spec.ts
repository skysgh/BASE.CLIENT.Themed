import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCorePagesLandingPricingComponent } from './component';

describe('IndexComponent', () => {
  let component: BaseCorePagesLandingPricingComponent;
  let fixture: ComponentFixture<BaseCorePagesLandingPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCorePagesLandingPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCorePagesLandingPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
