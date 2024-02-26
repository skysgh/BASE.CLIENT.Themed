## Development Directions ##

This is a front-end. Generally requiring a back-end. 

THe issue is what to do when there is not yet a back-end?

Install a small server that can be used to mock a real server.

* Navigate to the solution's root server (ie, where `packages.json` is)
* install it: `npm install --save json-server`
* Create a fake `/api/rest` directory in the root
* where you place a `/api/rest.db.json`file that contains table data (see example further down)
* create a `/api/routes.json` file

```json
{
  "/api/*": "/$1"
}

```json

```
The file api/db.json defines our API endpoints. In this example, we have one endpoint called /teams that will return a list of football teams.
```
