import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCorePagesLandingComingSoonComponent } from './component';

describe('ComingSoonComponent', () => {
  let component: BaseCorePagesLandingComingSoonComponent;
  let fixture: ComponentFixture<BaseCorePagesLandingComingSoonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCorePagesLandingComingSoonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCorePagesLandingComingSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
