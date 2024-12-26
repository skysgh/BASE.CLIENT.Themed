## Development Directions ##

`Core` is the *reusable* part of the project, 
that is not specific to any UI framework. 
It is kept in a separate folder to the theme specific 
implementations of sites.

Modules is the key directory, as it contains the core modules
that are loaded at start.

Notice the `modules/common` folder, which contains the common
Module (`BaseCoreCommonModule`).

Notice the `modules/common/components` folder, which contains the
`BaseCoreCommonComponentsModule` which then imports the above
`BaseCoreCommonModule`.

