@description('The name of the project. This informs automation of naming of resource groups, services, etc.')
param projectName string;

@description('The name of the project. This informs automation of naming of resource groups, services, etc.')
param projectServiceName string

@description('The name of the project environment. This informs automation of naming of resource groups, services, etc.')
@allowed (['NP','BT', 'DT','ST','UT','IT','PP','TR','PR'])
param projectEnvironmentId string

//@description('The default tags to merge in.')
//param resourceTags array = []

@description('The default location for resources. ')
param resourceLocation string

# Concat the pieces together:
var resourceName = toUpper(concat(projectName,projectServiceName?'_':'',projectServiceName,projectEnvironmentId))

resource resource 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: resourceName
  location: resourceLocation
  // tags: resourceTags
  identity: {
    type: 'string'
    userAssignedIdentities: {
      {customized property}: {}
    }
  }
  properties: {
    administratorLogin: 'string'
    administratorLoginPassword: 'string'
    administrators: {
      administratorType: 'ActiveDirectory'
      azureADOnlyAuthentication: bool
      login: 'string'
      principalType: 'string'
      sid: 'string'
      tenantId: 'string'
    }
    federatedClientId: 'string'
    isIPv6Enabled: 'string'
    keyId: 'string'
    minimalTlsVersion: 'string'
    primaryUserAssignedIdentityId: 'string'
    publicNetworkAccess: 'string'
    restrictOutboundNetworkAccess: 'string'
    version: 'string'
  }
}


// return the id (the fully qualitified name) of the newly created resource:
output resourceId string = resource.id

// return the (short) name of the newly created resource:
output resourceName string = resource.name

// param sink (to not cause error if param is not used):
output _ string = startsWith(concat(), 'z')
