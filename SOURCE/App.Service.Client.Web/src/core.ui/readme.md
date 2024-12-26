## Developement Directives ##

`Core.UI` is for reusable UI elements, that invokes only `Core` *Services*, etc.

It is separate from `Core`, as `Core` is usable 
across different frameworks (not just Angular), whereas `Core.UI` is specific to
a display framework -- Angular.

It is also seperate from `Themed`, as that is for 
UI elements that are tied to the theme, 
and may invoke other theme specific theme services 
or service that is outside of the reusable `Core`.

There are not many UI elements in `Core.UI` as you can't get very far without referencing
theme styles (`Pipes` are an example of one of the few un-styled ui aspects that are portable).

Note That `Themed` *Includes* `Core`, and not the other way around.

So in most cases you just need to import `Themed` and not `Core` or `Core.UI`.

