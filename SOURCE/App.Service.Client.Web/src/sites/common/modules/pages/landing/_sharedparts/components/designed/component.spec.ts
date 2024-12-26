import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAppsPagesLandingIndexDesignedComponent } from './component';

describe('BaseAppsPagesLandingIndexDesignedComponent', () => {
  let component: BaseAppsPagesLandingIndexDesignedComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexDesignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseAppsPagesLandingIndexDesignedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexDesignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
