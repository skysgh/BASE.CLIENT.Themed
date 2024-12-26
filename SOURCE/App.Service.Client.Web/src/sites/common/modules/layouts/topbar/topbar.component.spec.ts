import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutTopBarComponent } from './topbar.component';

describe('BaseLayoutTopBarComponent', () => {
  let component: BaseLayoutTopBarComponent;
  let fixture: ComponentFixture<BaseLayoutTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseLayoutTopBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
