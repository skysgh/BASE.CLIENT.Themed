## Development Directives ##


App.let/module specific 'fake' static `json` data sources are in this directory.

The `json` files are not put under `static/` because while it's not the intended
use case (when demoing, for example), the data can be manipulated using an 
instance of `InMemoryDbService`, for example.

Note:
Some may notice that the values under `sensitive` match the data 
in `_custom/json-server/data.json`. That's correct. We're just showing 
two ways developers can embed demo (non-production) code in a system for 
demo/startup purposes.
