## Development Directives ##


But by default `angular.json` defines `src/assets/` as the assets directory. 




But it would be best to have as many assets as reasonable
be portable between projects (eg: flags).

But it does means that you have to specify in the 
`angular.json` file what are the various assets 
directories. 

One would probably have, for example: 

* `core.ui/assets/` for reusable UI elements
* `themed/assets/` for theme specific UI elements
* `app/assets/` for application specific assets
* `app.lets/assets/` for application specific assets that are not part of the main application.
  * TODO: note that I'm not sure yet how to make that work for 3rd party plugins.


## Configuration ##

If you place files under `src/core/assets/`, they won’t be served unless explicitly configured.

The work around is not as simple as adding `src/core/` to the `angular.json` file.

You have to add the following to the `angular.json` file:

```json
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              "src/core/assets",
              {
                "glob": "**/*",                  // Matches all files recursively
                "input": "src/core/assets",      // Your custom directory
                "output": "core/assets"          // Public path
              }
            ]
          }
        }
      }
    }
  }
}
```
