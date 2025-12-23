
## Decisions ##
* Typescript, because JS is a typeless language and it's hard to maintain a large codebase without types.
* Angular because it's a mature framework with a lot of community support. 
  * Mostly because it's opinionated in terms of dependencies, so each developer
    that comes along doesn't itroduce their way way of doing things.
  * While slower to start than other options, it's easier to maintain in the long run.

  ## Constraints ##
* Dependencies:
  * Introduce the least number of Dependencies.
  * Avoid introducing dependencies in Features or Components. 
    Instead, prefer developing an in-app Service that wraps the external library.
  * Case in point, CookieService. Yes there is a well known library. But we're using an in-app service
    that wraps it. 

  ## Structure ##
* The objective is to keep a) as much as the codebase portable.
* Towards this objective, the codebase is structured as a set of 4 or 5 base folders:
* core: Contains the core services and components that are used throughout the app.
* coreAg: Contains the core services and components that are used throughout the app, but are specific to the Angular app.
* themes: Contains the themes that are used throughout the app.
* Sites: Contains site materials
* Apps: Contains the apps that are manifestations of sites.
* App.lets: Contains the applets that are used within App.

While I don't have it today, I'd like to be able to have Apps
late load App.lets based on a json file of some kind that defines
what App.lets are available to the App via late loading.
