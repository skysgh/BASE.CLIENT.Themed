import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseErrors404BasicComponent } from './component';

describe('BaseErrors404BasicComponent', () => {
  let component: BaseErrors404BasicComponent;
  let fixture: ComponentFixture<BaseErrors404BasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseErrors404BasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseErrors404BasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
