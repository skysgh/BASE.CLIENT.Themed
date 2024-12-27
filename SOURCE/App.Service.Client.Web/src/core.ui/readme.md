## Developement Directives ##

*Note:  
If `src` is level.00, and `Core` is "level.01",
think of `Core.UI` as "level.02" of the app.*

Whereas `Core` is for portable code, irrespective of framework,
there's only so far one can go before one has to deal with ui framework
in some way.

`Core.UI` is for reusable *ui framework* elements 
(but not necessarily UI elements, which would have references to styles).

`Core.UI` invokes only `Core` *Services* and *model*s without a reliance 
on anything specific to the `Themes`.

It is also seperate from `Themed`, as that is for 
UI elements that are tied to the theme, 
and may invoke other theme specific theme services 
or service that is outside of the reusable `Core`.

There are not many UI elements in `Core.UI` as you can't get very far without referencing
theme styles (`Pipes` are an example of one of the few un-styled ui aspects that are portable).

Note That `Themed` *Includes* `Core`, and not the other way around.

So in most cases you just need to import `Themed` and not `Core` or `Core.UI`.

