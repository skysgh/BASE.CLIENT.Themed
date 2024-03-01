## Development Directions ##

To minimise the amount of modifications required in
theme files, a new module and routing base is defined
here.



In a demo, everythings starts simple, with one primary type...
and then quickly gets more complicated, with an app containing
several primary entities. Each requiring their own set of BREAD views,
etc.
YOu either end up with a *lot* of files (components,html,css) 
in one folder, or you divie it up with folders. 
As we have done.

The same goes for modules...you either have one module at the app base
with lots of references to components... or again, you make submodules
per BREAD set so that the number of files per module remains manageable. 
As we have done.
That definately adds set up time...but it hopefully pays off later for
understandability and maintainability.



