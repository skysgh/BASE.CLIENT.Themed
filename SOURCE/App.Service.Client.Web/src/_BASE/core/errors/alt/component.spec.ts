import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltComponent } from './component';

describe('AltComponent', () => {
  let component: AltComponent;
  let fixture: ComponentFixture<AltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
