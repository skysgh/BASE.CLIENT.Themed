## Development Docuemntation ##


### First Run ###

#### Clone the Repo ####
1. Clone the repo from its origin at Github.
2. Run `npm install` to install the dependencies

#### First Configurations ####

1. In the root directory is the `package.json` file. 
  1. which has a `scripts` section 
  1. within which a couple of scripts are defined (`start`, etc.).
  1. In Visual Studio the Project file has a `StartupCommand` property that is set to `npm start`.
  1. when F5 is pressed, Visual Studio runs the `startupCommand`.
  1. 

#### First Runs ####

1. Run `npm start` to start the development server
1. Open `http://localhost:3000` in your browser



## Background ##

### Objectives ###

* As much as possible be reusable -- independent of Angular framework -- under `core/`.
* `sites/` (may become `themed/v1/sites/`, tbd) contains the landing page(s).
* `app/` (contains the `app` layout)
* `app.lets/`(contains plugins to `app/`)
