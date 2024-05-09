


// ------------------------------------------------------------
// ------------------------------------------------------------
// Resources Groups are part of the general subscription
@description('The name used to build resources. e.g.: \'BASE\'')
param projectName string

@description('The name used to build resources. e.g.: \'CLIENT\'')
param projectServiceName string = ''

@description('The id of the environment, to append to the name of resource groups. e.g.: \'BT\'')
@allowed([ 'NP',   'BT','DT','ST','UT','IT','PR'])
param environmentId string

@description('The tags for this resource. ')
param resourceTags object = {}

@description('The lowercase identifier of where to build the resource Group. Default is \'australiacentral\'.')
@allowed([ 'australiacentral'])
param groupResourceLocation string = 'australiacentral'

@description('The lowercase identifier of where to build the resource Group if resourceLocation2 is not available. Default is \'global\'.')
@allowed([ 'eastasia'])
param sqlFarmResourceLocation string = groupResourceLocation // in case in the future one can use the same as the group.

@description('Options are \'Free\' and \'Standard\'. Default is \'Free\'.')
@allowed([ 'Free', 'Standard' ])
param resourceSku string = 'Free'
// ------------------------------------------------------------
// 
// ------------------------------------------------------------
var fullName = concat(
    ${projectName}, 
    ${projectServiceName} ? '_':'',${projectServiceName},'_',
    ${environmentId});
var shortName = projectName;
var groupResourceName = toUpper(parentNameIsLonger?  fullName : shortName)
var parentResourceName = toUpper(parentNameIsLonger? fullName : shortName)
var childResourceName = toUpper(parentNameIsLonger? shortName : fullName)
var defaultTags = {'project':projectName,'service':projectServiceName, 'environment':environmentId}
var useTags = union(resourceTags, defaultTags)
// ------------------------------------------------------------
// 
// ------------------------------------------------------------


resource resourceGroupModule '../microsoft/resources/resourcegroups.bicep' = {
   // pass parameters:
  params: {
    resourceName: groupResourceName
    resourceLocationId: groupResourceLocationId
    resourceTags: resourceTags
  }
}


resource appServicePlanModule '../microsoft/web/serverfarms.bicep' = {
  // should be implied: 
  // dependsOn: [resourceGroupModule]
  scope: resourceGroupModule.outputs.name 
  params: {
    resourceName: parentResourceName
    resourceLocationId: resourceLocationId
    resourceTags: resourceTags
  }
}

module appSitesModule '../microsoft/web/sites.bicep' = {
  // should be implied: 
  // dependsOn: [appServicePlanModule]
  // pass parameters:
  params: {
    parentResourceId: appServicePlanModule.outputs.resourceId

    resourceName: childResourceName
    resourceLocationId: resourceLocationId
    resourceTags: resourceTags
  
    linuxFxVersion: linuxFxVersion
  }
}

module srcControlsModule '../microsoft/web/sites/sourcecontrols.bicep' = {
  // dependsOn: 
  // [appServicePlanModule, appSitesModule]
  params: {
    resourceName:  '${appSitesModule.outputs.resourceName}/web'
    resourceLocationId: resourceLocationId
    resourceTags:resourceTags

    repositoryUrl: repositoryUrl
    repositoryBranch: repositoryBranch
  }
}

output resourceId string = appSitesModule.outputs.id
output resourceName string = appSitesModule.outputs.name

// param sink (to not cause error if param is not used):
output _ = startsWith(concat(), 'z')
