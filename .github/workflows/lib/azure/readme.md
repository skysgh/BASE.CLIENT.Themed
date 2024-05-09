# Synopsis #

Folder for Azure specific reusable artefacts.


## Tips: Bicep ##
Super picky about syntax:
* DO NOT:
  * Don't forget to add `param` in front of params.
  * use "`"`" (use single quotes only)
  * end lines with "`;`"
  * Don't use `concat('foo','bar',etc...)` if you can string-interpolate
  * Do not leave `param`s unused.
  * Use a `var` or `output` ("'_'") to 'sink' `param`s that are not used.  

Scope is important to get right:
* You can define `scope:...` on `module`
* but you can't define them on `resource` (the resource arm won't have a `scope` `param`)
* The scope used when you invoke a bicep from a yaml workflow must match the `targetScope` at the top of the file
