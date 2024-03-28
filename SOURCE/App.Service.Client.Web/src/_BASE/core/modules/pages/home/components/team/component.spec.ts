import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAppsPagesLandingIndexTeamComponent } from './component';

describe('BaseAppsPagesLandingIndexTeamComponent', () => {
  let component: BaseAppsPagesLandingIndexTeamComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseAppsPagesLandingIndexTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
