import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutRightsidebarComponent } from './component';

describe('BaseLayoutRightsidebarComponent', () => {
  let component: BaseLayoutRightsidebarComponent;
  let fixture: ComponentFixture<BaseLayoutRightsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseLayoutRightsidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutRightsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
