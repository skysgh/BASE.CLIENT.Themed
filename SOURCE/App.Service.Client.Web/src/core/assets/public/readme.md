## Development Directives ##

The path to default `core` public static *asset* resources (such as `en.json` and flag files)
is defined in multiple places. 

First, in `angular.json`, which defines the asset root directories 
(in this case `core/assets/`).

Second, in `constants/system.assets.ts` 

```ts
static: {
  default: {
    i18n: "/core/assets/public/i18n/",
    images: {
      flags: "/core/assets/public/images/flags/",
    }
  },
```

The referenced for the first time within `AppModule` when it is up to the language service
to set the default language (`en`) and where to load `en.json` from.
