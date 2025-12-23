import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutHorizontalComponent } from './component';

describe('BaseLayoutHorizontalComponent', () => {
  let component: BaseLayoutHorizontalComponent;
  let fixture: ComponentFixture<BaseLayoutHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseLayoutHorizontalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
