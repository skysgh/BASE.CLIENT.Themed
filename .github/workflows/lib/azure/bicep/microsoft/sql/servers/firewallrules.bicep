// ======================================================================
// Reference
// ======================================================================
// https://medium.com/@joepschrama/deploy-a-sql-database-using-bicep-381d304d6e28

// ======================================================================
// Scope
// ======================================================================
//targetScope='resourceGroup'// NO: it stops resourceGroup().location from working: 'subscription'

// ======================================================================
// Import Shared Settings
// ======================================================================
var sharedSettings = loadJsonContent('../../settings/shared.json')

// ======================================================================
// Parent Resource
// ======================================================================
@description('The name of parent Database.')
param parentDatabaseServer string

// ======================================================================
// Default Name, Location, Tags,
// ======================================================================
// Resources Groups are part of the general subscription
@description('The title of this firewall Rule.  1-128. Can't use: \'<>*%&:;\/?\' or control characters or endend with period.')
@minLength(1)
@maxLength(128)
param resourceTitle string

@description('The name of parent Database.')
param parentDatabase string

@description('The range start.')
param startIpAddress string

@description('The range end.')
param endIpAddress string

resource resource 'Microsoft.Sql/servers/firewallRules@2021-11-01-preview' = {
  name: firewallTitle
  parent: parentDatabaseServer
  properties: {
    startIpAddress: startIpAddress
    endIpAddress: endIpAddress
  }
}

// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
output resource object = resource
output resourceId string = resource.id
output resourceName string = resource.name
output resourceSummary string = 'DbServer FirewallRule Summary: [Name: ${resource.name), Range: ${startIpAddress}-${endIpAddress}]'

// param sink (to not cause error if param is not used):
output _ bool = startsWith('${sharedSettings.version}', '.')