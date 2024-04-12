import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAppsPagesLandingIndexContactComponent } from './component';

describe('ContactComponent', () => {
  let component: BaseAppsPagesLandingIndexContactComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseAppsPagesLandingIndexContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
