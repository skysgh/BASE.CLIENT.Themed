## Development Directives ##

All these components reference the theme's style attributes
so they are not portable between themes. 

Hence why they are here, and not under 
`v0/ (portable)` directory.


These components are includable on various views displayed
in the intended target area within `layout/`.

Examples will include:

* `breadcrumbs`, shown at the top of the page 
  * TODO: this might be best refactored to be part of the layout
    so to developers don't have to remember to put it on each page.
* `footers` on the bottom of the page.
  * TODO: this might be best refactored to be part of the layout
    so to developers don't have to remember to put it on each page.
* `socialmedialinks`:
  * part of the footers.
* `CookieAlertSimple`
  * TODO: again, this might be better placed as part of the layout.
* `Notifications`...
  * Service, Account, User notifications.
  * TODO: again, this might be better placed as part of the layout.

What remains will include components shown on the desktop or other views:

* `Stats`
* `SummaryItem`/`SummaryItemSelector`, etc.
