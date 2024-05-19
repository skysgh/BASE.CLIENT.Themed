// ======================================================================
// Scope
// ======================================================================
//targetScope='resourceGroup'// NO: it stops resourceGroup().location from working: 'subscription'
targetScope='subscription'

// ======================================================================
// Import Shared Settings
// ======================================================================
var sharedSettings = loadJsonContent('../settings/shared.json')

// ======================================================================
// Default Name, Location, Tags,
// ======================================================================
// Resources Groups are part of the general subscription
@description('The name used to build resources. e.g.: \'BASE\'')
@maxLength(11) // Limited by storageAccount name length (24) minus 13 chars for uniqueString(...)
param projectName string

@description('The name used to build resources. e.g.: \'CLIENT\'')
param projectServiceName string = ''

@description('The id of the environment, to append to the name of resource groups. e.g.: \'BT\'')
@allowed([ 'NP',   'BT','DT','ST','UT','IT','PP','TR','PR'])
param environmentId string
// ------------------------------------------------------------
// ------------------------------------------------------------
@description('The tags for this resource. ')
param resourceTags object = {}
// ------------------------------------------------------------
// ------------------------------------------------------------
@description('The lowercase identifier of where to build the resource Group. Default is \'australiacentral\'.')
@allowed([ 'australiacentral'])
param resourceGroupLocationId string //NO. Fails most times. = resourceGroup().location

@description('Location of Server.')
//TOO Big: @allowed([ 'australiacentral'])
param sqlServerLocationId string  // in case in the future one can use the same as the group.

@description('Location of Database. ')
//TOO Big: @allowed([ 'australiacentral'])
param sqlServerDbLocationId string  // in case in the future one can use the same as the group.


// ======================================================================
// Default SKU, Kind, Tier where applicable
// ======================================================================


@description('Database SKU Options are \'Free\' and \'Standard\'. Default is \'Free\'.')
@allowed([ 'Basic', 'Standard' ])
param resourceSKU string = 'Basic'

@description('Database Tier. Options are \'Standard\' (Common workloads) and \'Premium\' (OLTP applications, with high transaction rates, low I/O latency plus several isolated replicas). Default is \'Standard\'.')
@allowed(['Standard', 'Premium' ])
param resourceTier string = 'Standard'

@description('TODO:...')
@allowed(['None','SystemAssigned','SystemAssigned,UserAssigned','UserAssigned'])
param sqlServerIdentityType string

// ======================================================================
// Resource other Params
// ======================================================================
@description('An Admin User\'s Name, to create the DB in the first place. Source from a pipeline environment Secret or pipeline accessible keyvault.')
@minLength(5)
@maxLength(128)
@secure()
param sqlServerAdminUserName string 

@description('An Admin User\'s Pwd, to create the DB in the first place. Source from a pipeline environment Secret or pipeline accessible keyvault. Must have 3 of 4 of [a-z], [A-Z], [0-9], or [specialchars]')
@minLength(8)
@maxLength(128)
@secure()
param sqlServerAdminPassword string 

// ======================================================================
// Default Variables: useResourceName, useTags
// ======================================================================

// Use formatting. And cleanup if service name not used. There is no trim('_') unfortunately.
var tmp1 = (empty(projectServiceName) ? '':format(sharedSettings.namingConventions.namingPartFormat, projectServiceName))
var tmp2 = (empty(environmentId)      ? '':format(sharedSettings.namingConventions.namingPartFormat, environmentId))
var fullName = replace(format(sharedSettings.namingConventions.namingFormat, projectName, tmp1,tmp2),'__','_') 
var shortName = projectName

var useResourceGroupName =  toUpper(sharedSettings.namingConventions.parentNameIsLonger ?  fullName : shortName)
// Sql Server Names can only be lowercase alphanumeric or hyphen (not underscore)
var useServerResourceName = toLower(replace('${useResourceGroupName}-${uniqueString(fullName)}' ,'_','-'))
var useInstanceResourceName =  toUpper(sharedSettings.namingConventions.parentNameIsLonger ? shortName : fullName)

var defaultTags = {project: projectName, service: projectServiceName, environment: environmentId}

var useResourceGroupLocation = resourceGroupLocationId
var useServerResourceLocation = sqlServerLocationId
var useInstanceResourceLocation = sqlServerDbLocationId 
var useTags = union(resourceTags, defaultTags)

// ======================================================================
// Resource bicep
// ======================================================================
module resourceGroupsModule '../microsoft/resources/resourcegroups.bicep' = {
   // pass parameters:
  name:  '${deployment().name}_resourceGroups_module'
  scope:subscription()
  params: {
    resourceName: useResourceGroupName
    resourceLocationId: useResourceGroupLocation
    resourceTags: useTags
  }
}


module serversModule '../microsoft/sql/servers.bicep' = {
  // should be implied: 
  dependsOn: [resourceGroupsModule]

  name:  '${deployment().name}_servers_module'
  scope: resourceGroup(useResourceGroupName)

  params: {
    resourceName: useServerResourceName
    resourceLocationId: useServerResourceLocation
    resourceTags: useTags

    
    // resourceSKU:....
    // resourceTier:....
    identityType: sqlServerIdentityType
    adminUserName: sqlServerAdminUserName
    adminPassword: sqlServerAdminPassword

}
}




// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
// output resource object = serversDatabasesModule.outputs.resource
// output resourceId string = serversDatabasesModule.outputs.resourceId
// output resourceName string = serversDatabasesModule.outputs.resourceName

// param sink (to not cause error if param is not used):
output _ bool = startsWith('${sharedSettings.version}-${resourceSKU}-${useInstanceResourceName}-${useInstanceResourceLocation}-${resourceTier}', '.')
