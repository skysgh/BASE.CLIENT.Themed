## Development Directives ##

Assets that do not contain sensitive information can be put in a public folder.
Examples, include *flags*, and *products* but do **NOT** include *images* of employees (that's PII).


The path to default `core` public static *asset* resources (such as `en.json` and flag files)
is defined in multiple places. 

First, in `angular.json`, which defines the asset root directories 
(in this case `core/assets/`).

Second, in `constants/system.assets.ts` 

```ts
static: {
  default: {
    i18n: "/core/assets/open/static/i18n/",
    images: {
      flags: "/core/assets/open/static/images/flags/",
    }
  },
```

The referenced for the first time within `AppModule` when it is up to the language service
to set the default language (`en`) and where to load `en.json` from.
