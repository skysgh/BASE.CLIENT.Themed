import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutVerticalComponent } from './component';

describe('BaseLayoutVerticalComponent', () => {
  let component: BaseLayoutVerticalComponent;
  let fixture: ComponentFixture<BaseLayoutVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseLayoutVerticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
