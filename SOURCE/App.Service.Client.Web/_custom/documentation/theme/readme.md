## Developer Directions ##

### Theme ###

THe solution is developed over a commercial theme.

* Advantages:
  * Can get started quicker.
  * Can concentrate on outcomes, functionality, maintainability and correctness 
  * before having to concentrate on aesthetics and accessibility.
* Concerns:
  * A **MUST** is to keep custom work contained to the `app/_custom` folder.
  * A **MUST** is keeping track of every default file that is modified. 
  * A **MUST** is persisting changed files within `custom` and the few files outside of `custom` so that they are not overriden when the underlying theme is upgraded.
* Disadvantages:
  * Some modification outside of `custom` remains required (`index.html`, `routing`, `favicon`, etc.). THere is risk of not tracking everything cahnged.
  * There is risk that when upgrading the theme that modified files are written over and time is lost identifying and recuperating them from the repository.


### Source ###

The theme is called *"Velzon"*, sourced from *Theme Forest*:
* Landing page: https://themeforest.net/item/velzon-aspnet-core-admin-dashboard-template/36077495
* Preview page: https://preview.themeforest.net/item/velzon-aspnet-core-admin-dashboard-template/full_screen_preview/36077495
* Example: https://themesbrand.com/velzon/html/minimal/dashboard-crm.html
* Admin page: https://velzon.themesbrand.com/user-dashboard
  * Use this page to download a more appropriate package for Angular only.

The package contains several styles and layouts.
* the specific style chosen from the above theme package was `Minimal` and `vertical`.

The download page provides 3 downloads (Admin, Simple, Documentation).
* `Simple` was used to start the new project, as it stripped of most pages (not all).
* `Admin` was downloaded and expanded as a reference


**IMPORTANT:**
The zips and files **MUST** not be persisted (they take up some 400Mb). 
Use the **EXCLUDED** folder for both downloaded zips and their expandsions.

