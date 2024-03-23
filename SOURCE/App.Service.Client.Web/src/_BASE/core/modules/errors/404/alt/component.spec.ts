import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseErrors404AltComponent } from './component';

describe('BaseErrors404AltComponent', () => {
  let component: BaseErrors404AltComponent;
  let fixture: ComponentFixture<BaseErrors404AltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseErrors404AltComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseErrors404AltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
