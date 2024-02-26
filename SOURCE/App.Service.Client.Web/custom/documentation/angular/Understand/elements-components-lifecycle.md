## Development Directives ##

you inform a component or directive that you want to be called back:

```ts
export class AfterViewComponent implements  OnInit, AfterViewInit{
  private prevHero = '';


  ngInit() {...}

  ngAfterViewInit(){...}

}
```

The following events can be hooked by telling the component:


* * 'ngOnChanges()'
* **'ngOnInit()'**: called once after the **first** ngOnChanges()
* 'ngDoCheck()': 
* 'ngAfterContentInit()': called once after ngDoCheck()
* **'ngAfterViewInit()'**: called once after ngAfterContentChecked()
* 'ngAfterViewChecked()': 
* 'ngOnDestroy()' 

## Source Info

* https://angular.io/guide/lifecycle-hooks
