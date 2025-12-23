
Angular apps are more or less nested NgModules.

## Modules - Chjaracteristics ##
NgModules configure the injector and the compiler and help organize related things together.



## Modules - Types Of ##
There isn't a formal (code based) difference, but Modules can be classified as one of:
* *Root Module*, the entry Module invoked from `main.ts`.
  * Can be used to define services, etc. common to all nested Modules,
  * However, it's far more portable to keep them as thin as possible, and 
    `import` and `export` *Support Modules* where this is done. 
  * Note: there may be reference to several *support Modules* -- one being a Common one, regardless 
    of Theme, one for the current Theme, and one specific to the custom App itself.
* *Support Modules*, which define and export Pipes, Directives, etc, even Components, but not
*   navigable *View* or *Feature* Modules.
* *Feature Modules*, that are nested under that. 
  * which include Domain, or Applet, Modules, that in turn define a set of Views that work together.
  * Lazy Loaded Modules are simply *feature* modules that are loosely coupled.

All apps have [at least one] *root module*, the `src/app.module.ts` invoked from `index.html`.


A module is a file that 
* starts with imports
* then below that a class decorated with the `@NgModule` directive.
* `@NgModule` directive/metadata 

* Modules are *singletons*. 
* * is **self-sufficient** importing what it needs.
* Angular does NOT have a hierarchical structure - it's flat.
* It imports what it needs.

## Super Important: Relationships in between 

Modules can import - and export - related modules.

What this implies is that it's often *not* like a file system where the 
parent object (folder) always contains child objects (child folders).

And yet it does in some cases. 

What is meant by that is that a RouteModule can import some free standing featureModule that is *not* imported & exported 
by a parent module, but does import CommonModule because it relies on it -- or, to be more precise, the PipeModule and DirectiveModule
that COmmonModule relies on. 
Borrowing terminology from SOLID and DDD, one could almost think as CommonModule as a Supporting Entity that has associated 
Value objects (sortof). Basically, they form a whole entity, and when you import it you get 3 for the price of 1.

**Instead of thinking 'the parent provides everythign the child needs, think a module explicitely declares all its dependencies
which can be a single module or a clump thereof.**


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
  declarations: [
  // Components, Directives, Pipes developed in this Module.
  AppComponent
  ],
  // provides injectable *imported** serivces to child components.
  providers: [],

  // Imports other *modules* imported above.
  // Some will be Ag provided, some will be your custom nested feature modules.
  imports: [BrowserModule],

  // only on the RootModule, this tells what is the root component 
  // to inject within itself (the `app-root` tag on the index.html page.)
  bootstrap: [AppComponent]
})
// class, exported.
export class AppModule {}

```

So, in this theme's case, our index.html shows where the `<app-root></app-root>` goes.




## Support Modules ##

A Support Module includes in a single operation a series of supporting services, pipes, directives. 

As such, it's highly probable that you would set it up as follows:

- XYZSupportModule, includes and exports child modules:
  - Directives/XYZDirectivesModule
  - Interceptors/XYZInterceptorsModule
  - Pipes/XYZPipesModule
  - Components/XYZComponentsModule

The one that is most problematic in the above list is the `XYZComponentsModule` and some decisions have to be made first.

Whereas you want to include Components you'll use often and are light (Components/Common/XYZSomeLightComponent)
you really don't want to include components that you won't be using often and may rely on heavy libraries (PDF, etc.)
(`Components/Uncommon/XYZHeavyComponent`).


## ComponentModules ##

So if you won't be including edge case components in a Support Module, what do you do?

Current (versus older) versions of Angular allow you to skip creating a module for a component and define them 
as `standalone:true`.  That's an option. 
Personally, I'm still a little trepidatious of  
