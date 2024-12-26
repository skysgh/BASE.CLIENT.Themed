import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseErrors404CoverComponent } from './component';

describe('BaseErrors404CoverComponent', () => {
  let component: BaseErrors404CoverComponent;
  let fixture: ComponentFixture<BaseErrors404CoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseErrors404CoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseErrors404CoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
