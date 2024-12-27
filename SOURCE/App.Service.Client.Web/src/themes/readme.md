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



