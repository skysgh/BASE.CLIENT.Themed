import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCoreCommonComponentsBreadcrumbsComponent } from './component';

describe('BaseCoreCommonComponentsBreadcrumbsComponent', () => {
  let component: BaseCoreCommonComponentsBreadcrumbsComponent;
  let fixture: ComponentFixture<BaseCoreCommonComponentsBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseCoreCommonComponentsBreadcrumbsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCoreCommonComponentsBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
