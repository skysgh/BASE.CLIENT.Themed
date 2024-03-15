import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCoreLandingPricingComponent } from './component';

describe('IndexComponent', () => {
  let component: BaseCoreLandingPricingComponent;
  let fixture: ComponentFixture<BaseCoreLandingPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCoreLandingPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCoreLandingPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
