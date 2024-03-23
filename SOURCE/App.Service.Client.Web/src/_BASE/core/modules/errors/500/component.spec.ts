import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseErrors500TodoComponent } from './component';

describe('BaseErrors500TodoComponent', () => {
  let component: BaseErrors500TodoComponent;
  let fixture: ComponentFixture<BaseErrors500TodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseErrors500TodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseErrors500TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
