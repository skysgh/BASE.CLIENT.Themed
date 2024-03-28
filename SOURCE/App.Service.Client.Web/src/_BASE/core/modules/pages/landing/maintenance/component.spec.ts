import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCorePagesLandingMaintenanceComponent } from './component';

describe('BaseCorePagesLandingMaintenanceComponent', () => {
  let component: BaseCorePagesLandingMaintenanceComponent;
  let fixture: ComponentFixture<BaseCorePagesLandingMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCorePagesLandingMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCorePagesLandingMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
