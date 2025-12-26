## Development Directives ##

Note:
To work correctly, Directory is defined as an asset directory in `angular.json`.

Note:
See `data/` directory as well.

App/let specific assets (images, styles, scripts) are in this directory.

It is marked as an asset directory in the `angular.json` file so that 
it is copied to the `dist/` directory when the app is built.

The data is separated into `open` and `sensitive` subdirectories. 
`open/` data can be CDN'ed because and are ok to be accessed
by any and all users, but `private/` assets - data, records, 
PII images, etc. -- are not, and are to be always treated with consideration.


