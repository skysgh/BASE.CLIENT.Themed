## Development Directives ##

`BaseCoreCommonModule` is included by most `modules`, and then used by most of their `components`.
It contains common pipes, components, etc. that can be used within other apps.

It is also invoked by `AppModule` in `_app` and is therefore available to all modules.

## Todo ##

It might still currently contain controls that are not reused, and therefore should be moved
somwhere else.
