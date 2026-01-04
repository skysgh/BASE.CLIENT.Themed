import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAppsPagesLandingIndexWorkProcessComponent } from './component';

describe('BaseAppsPagesLandingIndexWorkProcessComponent', () => {
  let component: BaseAppsPagesLandingIndexWorkProcessComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexWorkProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseAppsPagesLandingIndexWorkProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexWorkProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
