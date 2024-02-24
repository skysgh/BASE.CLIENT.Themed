Angular apps are more or less nested NgModules.

NgModules configure the injector and the compiler and help organize related things together.

There are two types of Modules:
* the Root Module 
* Feature Modules that are nested under that. 

All apps have [at least one] *root module*, the `src/app.module.ts` invoked from `index.html`.


A module is a file that 
* starts with imports
* then below that a class decorated with the `@NgModule` directive.
* `@NgModule` directive/metadata 


# About the Root Module

* Although the first, the root module not very different than any other module, except:
  * one key difference is that a root module imports `BrowserModule` whereas 
    all feature modules import `CommonModule` instead.
    * Note that `BrowserModule` inherits from `CommonModule` so it 
    * all really the same thing. just that it is making it specific to display in a browser.
    * All other modules should not import `BrowserModule` and stick to the more UI independent `CommonModule`



Components can be defined as `standalone` or part of a module.
I find that in most cases, components are part of a module.

THe browser module is: 

```ts
// imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// @NgModule decorator with its metadata
@NgModule({
  // define what Components belong to it (are not `standalone`)
  declarations: [AppComponent],

  // Imports other *modules* imported above.
  // Some will be Ag provided, some will be your custom nested feature modules.
  imports: [BrowserModule],

  // provides injectable *imported** serivces to child components.
  providers: [],

  // only on the RootModule, this tells what is the root component 
  // to inject within itself (the `app-root` tag on the index.html page.)
  bootstrap: [AppComponent]
})
// class, exported.
export class AppModule {}

```

So, in this theme's case, our index.html shows where the `<app-root></app-root>` goes.


