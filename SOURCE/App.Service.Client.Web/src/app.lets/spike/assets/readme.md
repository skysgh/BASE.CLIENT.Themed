## Development Directives ##

App/let specific assets (images and static data sources) are in this directory.

It is marked as an asset directory in the `angular.json` file so that 
it is copied to the `dist/` directory when the app is built.

The data is separated into `public` and `private` subdirectories. 
`public/` data can be CDN'ed because and are ok to be accessed
by any and all users, but `private/` assets - data, records, 
PII images, etc. -- are not, and are to be always treated with consideration.

The `private/data/` subdirectory contains static JSON data sources. 

