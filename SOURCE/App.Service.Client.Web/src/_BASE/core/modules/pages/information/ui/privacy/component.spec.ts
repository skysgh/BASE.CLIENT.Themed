import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseInformationPrivacyPolicyComponent } from './component';

describe('PrivacyPolicyComponent', () => {
  let component: BaseInformationPrivacyPolicyComponent;
  let fixture: ComponentFixture<BaseInformationPrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseInformationPrivacyPolicyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BaseInformationPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
