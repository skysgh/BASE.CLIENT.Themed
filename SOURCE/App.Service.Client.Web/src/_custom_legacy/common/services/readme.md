## Development Directions ##

This folder is for services common to all the `apps`.

Examples would include services such as:

* `DiagnosticsLoggingService`: service to develop diagnostics trace messages to the console.
* `ErrorRecordingService`: service to develop records of errors. 
* `CommsService`: service to manage communication back to the server.
* etc.

**Note:** 
Many of the services are using common models developed within [common models](../models/)
But should not be mentioning any models developed under one of the [apps](../../apps)
