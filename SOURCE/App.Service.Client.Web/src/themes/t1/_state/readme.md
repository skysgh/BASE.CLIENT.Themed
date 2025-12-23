## Developement Directives ##

Rx State is an in memory state bag.

It is not persisted between page refreshes.

How it works is as follows:

- a state object interface is created (see *-state.ts)
- an initial state object is created based on the interface, and its properties given initial values (see *-state.ts), 
- the values given could be limited to values from constants defined seperately (see *-constants.ts).
- a reducer is defined that defines the initial state and
  changes to make to one or more properties of the given state. (see *-reducer.ts).
- selectors are created that can then be referenced from components to get the state values (see *-selectors.ts).
- elsewhere in the application, the state is updated by dispatching actions (see *-actions.ts).


```ts
 import { Observable } from 'rxjs';
 import { getLayoutTheme, getSidebarSize } from './layout.selectors';

 @Component({
   selector: 'app-layout',
   template: `
         <div [class]="theme$ | async">
             Sidebar size: {{ sidebarSize$ | async }}
         </div>
     `,
 })
 export class LayoutComponent {
   theme$: Observable<string>;
   sidebarSize$: Observable<string>;

   constructor(private store: Store) {
     this.theme$ = this.store.select(getLayoutTheme);
     this.sidebarSize$ = this.store.select(getSidebarSize);
   }
 }

```

And actions are dispatched by invoking an action, passing it the params it expects. 
like so:

```ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { login } from './authentication.actions';

@Component({
  selector: 'app-login',
  template: `
    <button (click)="onLogin()">Log In</button>
  `,
})
export class LoginComponent {
  constructor(private store: Store) {}

  onLogin() {
    this.store.dispatch(login({ username: 'user@example.com', password: 'password123' }));
  }
}
```
