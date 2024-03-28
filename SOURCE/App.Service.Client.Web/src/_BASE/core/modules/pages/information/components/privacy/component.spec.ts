import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCorePagesInformationPrivacyPolicyComponent } from './component';

describe('PrivacyPolicyComponent', () => {
  let component: BaseCorePagesInformationPrivacyPolicyComponent;
  let fixture: ComponentFixture<BaseCorePagesInformationPrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCorePagesInformationPrivacyPolicyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BaseCorePagesInformationPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
