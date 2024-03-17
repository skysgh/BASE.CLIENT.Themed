import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutTwoColumnComponent } from './two-column.component';

describe('BaseLayoutTwoColumnComponent', () => {
  let component: BaseLayoutTwoColumnComponent;
  let fixture: ComponentFixture<BaseLayoutTwoColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseLayoutTwoColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutTwoColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
