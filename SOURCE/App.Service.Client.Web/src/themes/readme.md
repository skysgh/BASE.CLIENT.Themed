## Development Directives ##

*Note:  
If `src` is level.00, `core` is "level.01",
and `core.uI` is "level.02", think of `themes` 
as "level.03" of the app.*

Over a service lifespan (e.g. 10 years)
it should be expected that the service's UX will 
will require being re-implemented in different 
themes over time to remain of interest to end users.

At times there may be a need for two themes at the same
time to A/B compare adoption by end users.

While the themes may change, the non-ux specific `core` 
section should require no change.

It would be best if the ux could be shared across multiple
themes, but that remains an unsolved problem. 

The reason it's remains unsolved is that is that the 
html elements in the `sites` reference styles
that are part of a *specific* theme. 

Even with tremendous refactoring of not one but *two or more* 
different theme style sheets, there is no guarantee the two 
can be aligned, so remains a probably futile exercise.

In the meantime, though, even the `sites` are template specific,
they will be kept seperate and parallel to the `themes`.


### Multiple versions ###

It might seem redundent at first to make a whole
sub directory and namespace for a theme version
when there is only one theme so far. 

But 10-12 years is a long time. And in that time 
one can expect to at the very least reskin an app.

And while working on 'V2', you won't be able to 
take down the old one as you have current users - 
and it's probably unwise to release a complete makeover
without an ability to fall back to a previous theme
if things go pear shaped once release. 

You have a couple of ways to do it.
If you are 100% sure you are just changing the visual
aspects, without changes at all to the theme, 
you could keep the modules and component `ts`
files and provide a V2 `html` file.

But it's more than likely that at that future date 
the theme you want to move to is using a different
Framework version, that the older theme was never 
upgraded to (and is probably out of support).

In which case you'll have to update the `ts` files as well.

Looking at it from that wider context of the whole
service lifespan, adding a 'V1' namespace doesn't 
sound like so much of an over-engineering (although I'll 
admit that it doesn't sound that convincing that it will 
actually work when put to the test - there will be too
many differences to host multiple themes and frameworks
in one project).

