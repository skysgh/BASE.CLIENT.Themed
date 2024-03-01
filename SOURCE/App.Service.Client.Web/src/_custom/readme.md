# Development Directions #

## Constraint: Why Separation of Development Areas
To keep things separate from the underlying commercial theme,
So that the underlying theme can be updated when the vendor makes them available,
it is very important to keep custom code separate.

That's what this folder is for - common services and logical modules.

## Still work required to clearly separate new custom work from the underlying theme.

Unfortunately, the above doesn't solve everything.

Currently there is still a lot of linking going on in different areas: 
* Menus:
* multiple menus exist under `/layouts/` and they each have to be updated.
* the text that is shown in each `layouts/*type*/menu.ts` is coming frmo the 
* `assets/i18n.json` file.

## Warning ##
 
In other words, it is pretty intertwined at present, and extreme care will
be needed when refreshing the underlying theme package.

