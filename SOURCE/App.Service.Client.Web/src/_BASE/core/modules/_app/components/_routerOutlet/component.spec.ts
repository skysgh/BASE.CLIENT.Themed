import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRouterOutletComponent } from './component';
import { SystemService } from '../../../../services/system.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        BaseRouterOutletComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(BaseRouterOutletComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'velzon'`, () => {
    const fixture = TestBed.createComponent(BaseRouterOutletComponent);
    const app = fixture.componentInstance
    // TODO: Make it refer to system settings. 
    expect(app.browserTitle).toEqual('BASE');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(BaseRouterOutletComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('velzon app is running!');
  });
});
