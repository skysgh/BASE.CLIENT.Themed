## Development Directions ##

For want of a better word, a `View Transfer Object` 
are entities used to build up view models. 

They are not exactly the same as DTOs -- which is what 
is being sent across the wire -- they're enrichened, containing
properties specific to developing views in a service client,
such as having added a property to hold a specific `iconId`
or `imageName` appropriate for rendering purposes to match e.g. a `state` property.



