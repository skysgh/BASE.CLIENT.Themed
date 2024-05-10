var sharedSettings = loadJsonContent('../settings/shared.json')
// ------------------------------------------------------------
// ------------------------------------------------------------
//targetScope='resourceGroup'// NO: it stops resourceGroup().location from working: 'subscription'
// ------------------------------------------------------------
// ------------------------------------------------------------
// Resources Groups are part of the general subscription
@description('The name used to build resources. e.g.: \'BASE\'')
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
@allowed([ 'eastasia'])
param sqlFarmResourceLocationId string  // in case in the future one can use the same as the group.
// ------------------------------------------------------------
// ------------------------------------------------------------
@description('Options are \'Free\' and \'Standard\'. Default is \'Free\'.')
@allowed([ 'Free', 'Standard' ])
param resourceSku string = 'Free'
// ------------------------------------------------------------
// ------------------------------------------------------------
var tmp = empty(projectServiceName) ? '_':'_${projectServiceName}_'
var fullName = '${projectName}${tmp}${environmentId}' 
var shortName = projectName

var groupResourceName =  toUpper(sharedSettings.namingConventions.parentNameIsLonger ?  fullName : shortName)
var parentResourceName = toUpper(sharedSettings.namingConventions.parentNameIsLonger ? fullName : shortName)
var childResourceName =  toUpper(sharedSettings.namingConventions.parentNameIsLonger ? shortName : fullName)
var defaultTags = {project: projectName, service: projectServiceName, environment: environmentId}
var useTags = union(resourceTags, defaultTags)
// ------------------------------------------------------------
// ------------------------------------------------------------


module resourceGroupsModule '../microsoft/resources/resourcegroups.bicep' = {
   // pass parameters:
  name: 'resourceGroups_module'
  scope:subscription()
  params: {
    resourceName: groupResourceName
    resourceLocationId: groupResourceLocationId
    resourceTags: useTags
  }
}


module serverFarmsModule '../microsoft/web/serverfarms.bicep' = {
  // should be implied: 
  // dependsOn: [resourceGroupModule]
  name: 'appServicePlan_module'
  scope: resourceGroupModule
  params: {
    resourceName: parentResourceName
    resourceLocationId: sqlFarmResourceLocationId
    resourceTags: useTags
  }
}

output resourceId string = serverFarmsModule.outputs.id
output resourceName string = serverFarmsModule.outputs.name

// param sink (to not cause error if param is not used):
output _ bool = startsWith(concat(''), 'z')
