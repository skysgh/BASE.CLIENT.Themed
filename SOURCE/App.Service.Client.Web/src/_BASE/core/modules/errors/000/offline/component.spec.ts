import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseErrorsOfflineComponent } from './component';

describe('BaseErrorsOfflineComponent', () => {
  let component: BaseErrorsOfflineComponent;
  let fixture: ComponentFixture<BaseErrorsOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseErrorsOfflineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseErrorsOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
