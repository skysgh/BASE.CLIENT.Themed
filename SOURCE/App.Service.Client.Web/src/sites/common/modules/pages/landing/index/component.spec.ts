import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCorePagesLandingIndexComponent } from './component';

describe('IndexComponent', () => {
  let component: BaseCorePagesLandingIndexComponent;
  let fixture: ComponentFixture<BaseCorePagesLandingIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseCorePagesLandingIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCorePagesLandingIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
