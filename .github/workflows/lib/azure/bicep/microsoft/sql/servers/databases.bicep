// ======================================================================
// References:
// ======================================================================
// https://learn.microsoft.com/en-us/azure/azure-sql/database/single-database-create-bicep-quickstart?view=azuresql&tabs=CLI

// ======================================================================
// Scope
// ======================================================================
// Scope is parent resourceGroup:
targetScope='resourceGroup'

// ======================================================================
// Import Shared Settings
// ======================================================================
var sharedSettings = loadJsonContent('../../settings/shared.json')

// ======================================================================
// Dependencies
// ======================================================================
@description('the parent SqlServer.')
param parentResource object


// ======================================================================
// Default Name, Location, Tags,
// ======================================================================
@description('the name of this database resource.')
param resourceName string

@description('The id of the location for this resource.')
// @allowed([])
param resourceLocationId string

@description('The tags to merge for this resource.')
param resourceTags object = {}

// ======================================================================
// Default SKU, Tier, ...etc.
// ======================================================================
@description('The SKU of this resource.')
// @allowed(['Standard'])
param resourceSKU string = 'Standard'

@description('The Tier of this resource.')
// @allowed(['Standard'])
param resourceTier string = 'Standard'

// ======================================================================
// Default Variables: useResourceName, useTags
// ======================================================================
var useName = resourceName
var useLocation = resourceLocationId
var useTags = union(resourceTags,sharedSettings.defaultTags)

// ======================================================================
// Resource bicep
// ======================================================================

resource resoure 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: parentResource

  name: useName
  location: useLocation
  tags: useTags

  sku: {
    name: resourceSKU
    tier: resourceTier
  }
}

// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
// Provide ref to developed resource:
output resource object = resource
// return the id (the fully qualitified name) of the newly created resource:
output resourceId string = resource.id
// return the (short) name of the newly created resource:
output resourceName string = resource.name
// param sink (to not cause error if param is not used):
output _ bool = startsWith(concat('${sharedSettings.version}'), '.')
