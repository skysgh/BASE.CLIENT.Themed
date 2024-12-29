## About ##

`apps` is the folder containing **app.lets*,
which show up in the `app` main menu once signed in.

Example `apps` might include:
* `spikes`: where one can experiment on developing new common functionality.
* `demo`: to demonstrate the capabilities of an app (abstractly).
* `architecture`: an app suitable for an IT architecture practice
* `education`: an app of some kind suitable for the education domain
* etc.


## Development Directions ##


In a demo, everythings starts simple, with one primary type...
and then quickly gets more complicated, with an app containing
several primary entities. Each requiring their own set of BREAD views,
etc.

Yiu either end up with a *lot* of files (components,html,css) 
in one folder, or you divie it up with folders. 
As we have done.

The same goes for modules...you either have one module at the app base
with lots of references to components... or again, you make submodules
per BREAD set so that the number of files per module remains manageable. 
As we have done.
That definately adds set up time...but it hopefully pays off later for
understandability and maintainability.



