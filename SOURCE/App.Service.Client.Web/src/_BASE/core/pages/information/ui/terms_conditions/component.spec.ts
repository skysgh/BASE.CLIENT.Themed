import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseInformationTermsAndConditionsComponent } from './component';

describe('TermsConditionComponent', () => {
  let component: BaseInformationTermsAndConditionsComponent;
  let fixture: ComponentFixture<BaseInformationTermsAndConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseInformationTermsAndConditionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseInformationTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
