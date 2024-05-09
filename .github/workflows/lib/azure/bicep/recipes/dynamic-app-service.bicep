// NO. It stops resourceLocation().location from working: 
// targetScope='subscription'
targetScope='resourceGroup'

// ------------------------------------------------------------
// ------------------------------------------------------------

// Resources Groups are part of the general subscription
@description('Whether to name parent resources (e.g. resourceGroups, serverfarms, etc.) as with service and env names, or the other way around.')
param parentNameIsLonger bool = true

// Resources Groups are part of the general subscription
@description('The project name. This informs automation of naming of resource groups, services, etc. e.g.: \'BASE\'')
param projectName string

@description('The project service name. Name used to build resources. e.g.: \'SERVICE\'')
param projectServiceName string = 'SERVICE'

@allowed (['NP','BT', 'DT','ST','UT','IT','TR','PP','PR'])
param environmentId string

@description('The location for this resource. ')
// @allowed(...too long...)
param resourceLocationId string = resourceGroup().location

@description('The tags for this resource. ')
param resourceTags object = {}

@description('The app service plan SKU. ')
@allowed(['F1','D1','B1','B2','S1','S2'])
param webAppServicePlanSKU string = 'F1' // The SKU of App Service Plan

@description('The Function eXtension to define the runtime stack. Default = \'DOTNETCORE|Latest\'')
@allowed(['DOTNETCORE|2.2','DOTNETCORE|3.0','DOTNETCORE|3.1','DOTNETCORE|LTS','DOTNETCORE|Latest'])
param linuxFxVersion string = 'DOTNETCORE|Latest'

@description('The url to the repository to be deployed to the Server. ')
param repositoryUrl string

@description('The branch of the repository to use. TODO: this should depend on what branch was checked in.')
param repositoryBranch string = 'main'

@description('The folder within the repository that contains the source code of the service. ')
param repositorySourceLocation string = '/'



// ------------------------------------------------------------
// 
// ------------------------------------------------------------
var fullName = concat(
    projectName, 
    empty(projectServiceName) ? '':'_${projectServiceName}',
    '_',
    environmentId)
var shortName = projectName
var groupResourceName = toUpper(parentNameIsLonger?  fullName : shortName)
var parentResourceName = toUpper(parentNameIsLonger? fullName : shortName)
var childResourceName = toUpper(parentNameIsLonger? shortName : fullName)
var defaultTags = {'project': projectName, 'service': projectServiceName, 'environment': environmentId }
var useTags = union(resourceTags, defaultTags)
// ------------------------------------------------------------
// 
// ------------------------------------------------------------


module resourceGroupModule '../microsoft/resources/resourcegroups.bicep' = {
  name: 'XYZ'
  scope: subscription()
   // pass parameters:
  params: {
    resourceName: groupResourceName
    resourceLocationId: resourceLocationId
    resourceTags: useTags
  }
}


module appServicePlanModule '../microsoft/web/serverfarms.bicep' = {
  // should be implied: 
  // dependsOn: [resourceGroupModule]
  name: 'BBBBBB'
  scope: resourceGroup(groupResourceName) 
  params: {
    resourceName: parentResourceName
    resourceLocationId: resourceLocationId
    resourceTags: useTags

    webAppServicePlanSKU: webAppServicePlanSKU
  }
}

module appSitesModule '../microsoft/web/sites.bicep' = {
  // should be implied: 
  // dependsOn: [appServicePlanModule]
  // pass parameters:
  name: 'BBBBA'
  scope: resourceGroup(groupResourceName)
  params: {
    parentResourceId: appServicePlanModule.outputs.resourceId

    resourceName: childResourceName
    resourceLocationId: resourceLocationId
    resourceTags: useTags

    linuxFxVersion: linuxFxVersion
  }
}

module srcControlsModule '../microsoft/web/sites/sourcecontrols.bicep' = {
  // dependsOn: 
  // [appSitesModule]
  name: 'BBBB'
  scope: resourceGroup(groupResourceName) 
  params: {
    resourceName:  '${appSitesModule.outputs.resourceName}/web'
    resourceLocationId: resourceLocationId
    resourceTags: useTags

    repositoryUrl: repositoryUrl
    repositoryBranch: repositoryBranch
    repositorySourceLocation: repositorySourceLocation
  }
}

output resourceId string = appSitesModule.outputs.resourceId
output resourceName string = appSitesModule.outputs.resourceName
// param sink (to not cause error if param is not used):
output _ bool = startsWith(concat(''), 'z')
