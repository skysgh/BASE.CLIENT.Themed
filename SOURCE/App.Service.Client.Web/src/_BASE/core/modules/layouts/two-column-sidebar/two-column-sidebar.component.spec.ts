import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutTwoColumnSidebarComponent } from './two-column-sidebar.component';

describe('BaseLayoutTwoColumnSidebarComponent', () => {
  let component: BaseLayoutTwoColumnSidebarComponent;
  let fixture: ComponentFixture<BaseLayoutTwoColumnSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseLayoutTwoColumnSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutTwoColumnSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
