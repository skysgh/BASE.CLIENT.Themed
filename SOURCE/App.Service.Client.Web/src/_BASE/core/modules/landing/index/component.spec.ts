import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCoreLandingIndexComponent } from './component';

describe('IndexComponent', () => {
  let component: BaseCoreLandingIndexComponent;
  let fixture: ComponentFixture<BaseCoreLandingIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCoreLandingIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCoreLandingIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
