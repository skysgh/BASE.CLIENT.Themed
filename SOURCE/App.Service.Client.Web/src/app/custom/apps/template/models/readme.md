## Development Directions ##

Each app's `models` contains models specific to only this app.

**Note:**
Any model that requires spanning multiple apps needs to be defined
in the [common models](../../../common/models/) directory.


### About Display Models ###

Note how we're not using an raw model for 'Read' views.

That's *such* a common mistake
to think that a Read View should be invoking
a REST endpoint of the entity type itself,
rather than a different service, specific for
UI needs, that returns a richer object, a display
object.

Whereas an `Edit` view might fetch and bind to
a record instance (and that's generally for very simple systems)
retrieved with an Repository specific to that type,
a `Read` view does not. It should be getting a **displayable** model
from a different API, specific to meeting the needs of UI
(an api specific to a datastore type is more relevant to
providing interoperability to another system).
