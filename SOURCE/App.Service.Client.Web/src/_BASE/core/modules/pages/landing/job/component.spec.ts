import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCoreLandingJobComponent } from './component';

describe('JobComponent', () => {
  let component: BaseCoreLandingJobComponent;
  let fixture: ComponentFixture<BaseCoreLandingJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCoreLandingJobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseCoreLandingJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
