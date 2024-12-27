## Development Directives ##

This directory contains the translation files for the application. 
The files are in JSON format and are named according to the language they represent. 
For example, the file `en.json` contains the English translations.

But they are not the only ones. 

These are just `core/` ones that are used in most applications.

There are at least two others: 

* `templates/v1/assets/public/i18n/` for resources specific to the template, not the contents.
* `sites/assets/public/i18n/` for the resources displayed *within* the template.

These are imported by the LanguageTranslator that is configured in `AppModule`.
