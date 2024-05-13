var sharedSettings = loadJsonContent('../../../settings/shared.json')

// Resources are part of a parent resource group:
targetScope='resourceGroup'

@description('Name of parent Resource - a keyvault')
param parentResource string

@description('key of secret')
param key string

@description('string value of secret')
@secure
param secret string 


resource resource 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: parentResource
  name: key
  properties: {
    value: secret
  }
}

// Provide ref to developed resource:
output resource object = resource
// return the id (the fully qualitified name) of the newly created resource:
output resourceId string = resource.id
// return the (short) name of the newly created resource:
output resourceName string = resource.name
// param sink (to not cause error if param is not used):
output _ bool = startsWith(concat('${sharedSettings.version}'), '.')
