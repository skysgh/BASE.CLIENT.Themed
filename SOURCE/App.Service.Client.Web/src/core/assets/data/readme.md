## Development Directives ##

`Core` has services that return data, 
irrespective of framework used.

THe services in general return mutable, coming from servers.

But for first runs, configured as an `environments/` setting,
sometimes fake data is needed. Hence the `fake/` subdirectory.
Being fake, these data sources are not mutable and there just
for initial demo purposes.

Data, fake or not, should only contain data specific to the layout.
Otherwise, each applet should have its own data service(s), 
and wrapping repositorie(s).
