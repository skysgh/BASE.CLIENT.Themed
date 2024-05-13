// ======================================================================
// Import Shared Settings
// ======================================================================
var sharedSettings = loadJsonContent('../../settings/shared.json')
// ======================================================================
// Default Name, Location, Tags,
// ======================================================================
@description('resourceName')
@minLength(3)
@maxLength(22)
param resourceName string

@description('Deployment Location')
// Too long: @allowed(['westeurope''northeurope'])
param resourceLocationId string

@description('Resource Tags. Note: will be merged with the imported sharedTags.defaultTags.')
param resourceTags object = {}

// ======================================================================
// Default SKU, Kind, Tier where applicable
// ======================================================================

// See: https://learn.microsoft.com/en-us/rest/api/storagerp/srp_sku_types
@description('Resource SKU. Default is \'Standard_LRS\' (Standard Locally Redundant Storage). Other options are GLobally redundant (Standard_GRS), Zone Redundant(Standard_ZRS), etc..')
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_RAGRS'
  'Standard_ZRS'
  'Premium_LRS'
  'Premium_ZRS'
  'Standard_GZRS'
  'Standard_RAGZRS'
])
param resourceSKU string = 'Standard_LRS'

@description('Resource Kind. Default is: \'StorageV2\'')
@allowed(['StorageV2'])
param resourceKind string = 'StorageV2'

@description('Resource Tier. Default is: \'Hot\'')
@allowed(['Hot'])
param resourceTier string = 'Hot'

// ======================================================================
// Default Variables: useResourceName, useTags
// ======================================================================
// Develop default variables.
var useResourceName = resourceName;
var useTags = union(resourceTags,sharedSettings.defaultTags)

// ======================================================================
// Resource bicep
// ======================================================================
resource resource 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  // Must be lower case:
  name: toLower(useResourceName)
  location: resourceLocationId
  tags: useTags

  sku: {
    name: resourceSKU
  }
  kind: resourceKind
   properties: {
     accessTier: resourceTier
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
