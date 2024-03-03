## Development Directions ##

Each app's `./ui` folder is for the module's visible *components*. 

Vies are kept separate from the app's [services](../services) and associated [models](./models`),
even if this [app's services](../services/), along with [common services](../../../services/) 
will be dependeny injected into the component constructors.


Views usually include one or more of the following subfolders used to keep component parts together.

* `./route`: display area between this module's different views, which will
  often be one or more of the following:
* `./view`: used to view a view summary of a single record
* `./edit`: used to edit a record. May also navigate to child records.


The Views are generally organised as per the BREAD acronym:

* BROWSE [LIST]
* VIEW [SINGLE]
* EDIT [SINGLE]
* delete handled other ways.

**Note:**
it is expected at this point that the Browse view looses importance 
as we develop and improve
the overall general Search capability further.
