import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAppsPagesLandingIndexCapabilitiesComponent } from './component';

describe('BaseAppsPagesLandingIndexCapabilitiesComponent', () => {
  let component: BaseAppsPagesLandingIndexCapabilitiesComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexCapabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseAppsPagesLandingIndexCapabilitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexCapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
