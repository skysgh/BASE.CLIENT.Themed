// ======================================================================
// Scope
// ======================================================================
//targetScope='resourceGroup'// NO: it stops resourceGroup().location from working: 'subscription'

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
param groupResourceLocationId string //NO. Fails most times. = resourceGroup().location

@description('The lowercase identifier of where to build the resource Group if resourceLocation2 is not available. Default is \'global\'.')
//TOO Big: @allowed([ 'eastasia'])
param sqlFarmResourceLocationId string  // in case in the future one can use the same as the group.

@description(' is \'global\'.')
//TOO Big: @allowed([ 'eastasia'])
param sqlServerLocationId string  // in case in the future one can use the same as the group.


// ======================================================================
// Default SKU, Kind, Tier where applicable
// ======================================================================


@description('Options are \'Free\' and \'Standard\'. Default is \'Free\'.')
@allowed([ 'Free', 'Standard' ])
param resourceSku string = 'Free'

// ======================================================================
// Resource other Params
// ======================================================================


// ======================================================================
// Default Variables: useResourceName, useTags
// ======================================================================
var tmp = empty(projectServiceName) ? '_':'_${projectServiceName}_'
var fullName = '${projectName}${tmp}${environmentId}' 
var shortName = projectName

var useGroupResourceName =  toUpper(sharedSettings.namingConventions.parentNameIsLonger ?  fullName : shortName)
var useParentResourceName = toUpper(sharedSettings.namingConventions.parentNameIsLonger ? fullName : shortName)
var useCchildResourceName =  toUpper(sharedSettings.namingConventions.parentNameIsLonger ? shortName : fullName)

var defaultTags = {project: projectName, service: projectServiceName, environment: environmentId}

var useResourceGroupLocation = groupResourceLocationId
var useResourceLocation = sqlFarmResourceLocationId
var useLocation = sqlServerLocationId
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
  // dependsOn: [resourceGroupModule]
    name:  '${deployment().name}_servers_module'
  scope: resourceGroupModule
  params: {
    resourceName: useParentResourceName
    resourceLocationId: useResourceLocation
    resourceTags: useTags
  }
}



module serversDatabasesModule '../microsoft/sql/servers/databases.bicep' = {
  // should be implied: 
  // dependsOn: [resourceGroupModule]
    name:  '${deployment().name}_servers_databases_module'
  scope: resourceGroupModule
  params: {
    resourceName: useChildResourceName
    resourceLocationId: useLocation
    resourceTags: useTags
  }
}


// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
// Provide ref to developed resource:
output resource object = serversDatabasesModule.outputs.resource
output resourceId string = serversDatabasesModule.outputs.id
output resourceName string = serversDatabasesModule.outputs.name

// param sink (to not cause error if param is not used):
output _ bool = startsWith('${sharedSettings.version}', '.')
