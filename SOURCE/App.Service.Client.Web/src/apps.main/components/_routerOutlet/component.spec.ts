import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRouterOutletComponent } from './component';
//import { SystemService } from '../../../../../core/services/system.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        // Components, Directives, Pipes developed in this Module.
        BaseRouterOutletComponent
      ],
      imports: [
        RouterTestingModule
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(BaseRouterOutletComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'base'`, () => {
    const fixture = TestBed.createComponent(BaseRouterOutletComponent);
    const app = fixture.componentInstance
    // TODO: Make it refer to system settings. 
    expect(app.browserTitle).toEqual('BASE');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(BaseRouterOutletComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('base is running!');
  });
});
