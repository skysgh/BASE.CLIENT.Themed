## Development Directives ##

The Apps are the entry point of applications.


Most services have only one interface -- but it can be that there are more than one, 
aiming at different user bases. 

So, for now, there's only one - `main`.
It's for an adult working/corp general audience.
Maybe in some future, another screen, for a different audience (e.g. preschoolers)
could require being developed.

They may all import and one or more `app.lets`. Or some app.lets are intended
for different user bases. 

TODO:
It's pretty hard to build a site that is not themed in some way or another. 
So there is a strong argument for nesting `apps/` under `themes/vx/` ...but 
so far feel this is ok.


### About Modules ###

See `_custom/documentation` for more information on the modules in general.
