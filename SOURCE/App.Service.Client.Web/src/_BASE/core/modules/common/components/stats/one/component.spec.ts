import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCommonComponentsStatsOneComponent } from './component';

describe('CrmStatComponent', () => {
  let component: BaseCommonComponentsStatsOneComponent;
  let fixture: ComponentFixture<BaseCommonComponentsStatsOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCommonComponentsStatsOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCommonComponentsStatsOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
