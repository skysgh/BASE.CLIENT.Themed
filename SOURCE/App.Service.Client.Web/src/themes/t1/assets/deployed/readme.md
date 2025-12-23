## Development Directives ##

While Flag images are `core/` defaults, they are also theme specific.

Note:
The urls defined in `config/minimal/_variables.scss_` 
are relative to a directory under *this* directory, 
so they only `../` once rather than twice or 
three times.

TODO: have not yet figured out why/what is the entry point.

Note:
And yet `app.scss` refers to the font directory with `'../../'`
instead of `../`. Again, unclear why.

Note:
Same for `bootstrap.scss`.






TODO: 
ie, for at least now, you need to leave at least one flag image file here
as a theme specific css references the `00.flag` (via `$default_images_root`) 
during compilation.
