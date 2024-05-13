var sharedSettings = loadJsonContent('../../settings/shared.json')

@description('resourceName')
@minLength(3)
@maxLength(22)
param resourceName string

@description('Deployment Location')
@allowed([
  'westeurope'
  'northeurope'
])
param resourceLocationId string


@description('Resource Tags')
param resourceTags object = {}

var useTags = union(resourceTags,sharedSettings.defaultTags)

@description('Resource SKU. Default is \'Standard_LRS\' (Standard Locally Redundant Storage). Other options are GLobally redundant (Standard_GRS), Zone Redundant(Standard_ZRS).')
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

@description('Resource Kind. Default is: StorageV2')
@allowed(['StorageV2'])
param resourceKind string = 'StorageV2'


resource resource 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  // Must be lower case:
  name: toLower(resourceName)
  location: resourceLocationId

  sku: {
    name: resourceSKU
  }
  kind: resourceKind
   properties: {
     accessTier: 'Hot'
   }
  tags: useTags
}

output resourceId string = resource.id
output resourceName string = resource.name
