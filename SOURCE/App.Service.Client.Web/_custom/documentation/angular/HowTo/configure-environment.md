## Background observations ##

* within `src\environments` there are by default two environment files:
  * `environment.ts`
  * `environment.prod.ts`

  both containing whatever vars are specific to a deployment:

```ts
export const environment = {
  custom: {
    diagnostics: {
      // 5=Debug, 4=Verbose, 3=Info, 2=Warn, 1=Error
      level: 5
    },
```

The one that is chosen is determined by the follownig code in `/angular.json`:

```ts

{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "cli": {
    "analytics": "35c2a030-70e4-44b0-bcac-3c33ef95e5a5"
  },
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "base": {
      "projectType": "application",
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",

      "architect": {
          "configurations": {
            "production": {
              ...
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
            },
            "development": {
            ...and development doesn't have a section like that.
            }
            // Add more environment types here...
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "base:build:production"
            },
            "development": {
              "buildTarget": "base:build:development"
            }
            // Add more environment types here...
          },
          "defaultConfiguration": "development"
        },
        // And same for the e2e section.
```


The reason it changes is that you do:

```
ng serve --prod
or
ng serve --configuration=testing
```
If nothing is defined, it will default to `"defaultConfiguration": "development"`

