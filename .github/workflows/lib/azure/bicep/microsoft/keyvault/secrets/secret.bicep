@description('Name of parent Resource - a keyvault')
param parentResource string

@description('key of secret')
param key string

@description('string value of secret')
param secret string 


resource resource 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: parentResource
  name: key
  properties: {
    value: secret
  }
}

output resourceId = resource.id
output resourceName = resource.name