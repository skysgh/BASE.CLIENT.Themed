import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAppsPagesLandingIndexCtaComponent } from './component';

describe('BaseAppsPagesLandingIndexCtaComponent', () => {
  let component: BaseAppsPagesLandingIndexCtaComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseAppsPagesLandingIndexCtaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
