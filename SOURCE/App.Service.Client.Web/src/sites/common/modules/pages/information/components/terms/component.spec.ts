import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCorePagesInformationTermsComponent } from './component';

describe('TermsConditionComponent', () => {
  let component: BaseCorePagesInformationTermsComponent;
  let fixture: ComponentFixture<BaseCorePagesInformationTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCorePagesInformationTermsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseCorePagesInformationTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
