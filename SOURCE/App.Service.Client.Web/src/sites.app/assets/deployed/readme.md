## Development Directives ##

Even if there were several apps (ie layouts) 
developed in the future beyond thie first one (`apps/main`)
and they probably share several resources between them
it's preferable to put assets under each app, even if that
means some duplication. Hopefully this way, each app can be 
developed independently without risk of damaging another.

Note:
assets are left on the server and not packaged when compiled,
so duplication doesn't affect package size.

