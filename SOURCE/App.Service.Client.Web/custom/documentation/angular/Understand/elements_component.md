
A component controls a patch/area of screen.

It is a **class** decorated with **metadata** in the form of a `@Component` **directive**

It is composed of 1 to 3 files.


### Component File:

Named follows the following pattern: `<component-name>.component{.ext}`.
(eg: `base-demo-foobar.component.ts`).

### Example Contents

```ts

// Decorating Directive that binds the class with its view:
@Component({
  selector: 'base-demo-foobar'
  templateUrl: './base-demo-foobar.component.html'
  styleUrls : './base-demo-foobar.component.scss'
  // An array of the components, directives, and packages that your template references
  imports: []
  // Describe services:
  providers: [heroService],

})
export class HeroListComponent implements OnInit {
  // demonstrating properties visible to the html view:
  heroes: Hero[] = [];
  selectedHero: Hero | undefined;

  // demonstrating dependency injection
  constructor(private service: heroService) { }

  // demontrating lifecycle event handing (due to 'implements' above)
  ngOnInit() {
    // demonstrating initialisation of properties:
    this.heroes = this.service.getHeroes();
  }

  // demonstrating methods visible to the html view:
  selectHero(hero: Hero) { this.selectedHero = hero; }
}
```


First, define what this component relies upon:
`import { Component } from '@angular/core';`

Second section of code is for describing the component's and it's 3 basic things:

* * it's `selector` (ie, it's html tag), 
* the relative url to the associated `html view`, and 
* the relative url to the associated style sheet.

```
@Component({
  selector: 'base-demo-foobar'
  templateUrl: './base-demo-foobar.component.html'
  styleUrls : './base-demo-foobar.component.scss'
})
```

**Note**: One can inline html and css 
with `template` and `styles` 
but I recommend avoiding this approach.

## Standalone or ngModule
A component can be marked `standalone: true` or belong to a parent module.
Standalone is simpler, in that the component doesn't need to registered in a parent module.
But I don't find that to be too often the case.

Instead




