## Development Directives ##

By default `assets/` are in the `src/` directory.

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
