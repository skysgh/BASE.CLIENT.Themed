import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutHorizontalTopbarComponent } from './horizontal-topbar.component';

describe('BaseLayoutHorizontalTopbarComponent', () => {
  let component: BaseLayoutHorizontalTopbarComponent;
  let fixture: ComponentFixture<BaseLayoutHorizontalTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseLayoutHorizontalTopbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutHorizontalTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
