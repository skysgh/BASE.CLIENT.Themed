var sharedSettings = loadJsonContent('../settings/shared.json')
// ------------------------------------------------------------
// ------------------------------------------------------------
// NO. It stops resourceLocation().location from working: 
// targetScope='subscription'
// NO:targetScope='resourceGroup'
targetScope='subscription'
// ------------------------------------------------------------
// ------------------------------------------------------------
// Resources Groups are part of the general subscription
@description('The project name. This informs automation of naming of resource groups, services, etc. e.g.: \'BASE\'')
param projectName string

@description('The project service name. Name used to build resources. e.g.: \'SERVICE\'')
param projectServiceName string = 'SERVICE'

@allowed (['NP','BT', 'DT','ST','UT','IT','TR','PP','PR'])
param environmentId string
// ------------------------------------------------------------
// ------------------------------------------------------------
@description('The tags for this resource. ')
param resourceTags object = {}
// ------------------------------------------------------------
// ------------------------------------------------------------
@description('The location of the parent resource group. ')
// @allowed(...too long...)
param resourceLocationId string //NO:= resourceGroup().location

@description('The location of the parent resource group. ')
// @allowed(...too long...)
//NO:= resourceGroup().location
param groupResourceLocationId string = resourceLocationId 

@description('The location of the serverFarm.')
// @allowed(...too long...)
//NO:= resourceGroup().location
param serverfarmsResourceLocationId string  = groupResourceLocationId 

@description('The location of the server within the serverfarm. ')
// @allowed(...too long...)
//NO:= resourceGroup().location
param sitesResourceLocationId string = serverfarmsResourceLocationId 

@description('The location of the server within the serverfarm. ')
// @allowed(...too long...)
//NO:= resourceGroup().location
param sourcecontrolsResourceLocationId string = sitesResourceLocationId 
// ------------------------------------------------------------
// ------------------------------------------------------------
@description('The app service plan SKU. F1,D1,B1,B2,S1,S2')
@allowed(['F1','D1','B1','B2','S1','S2'])
param webAppServicePlanSKU string = 'F1'



@description('The Function eXtension to define the runtime stack. Consider using \'DOTNETCORE|Latest\'')
@allowed(['DOTNETCORE|2.2','DOTNETCORE|3.0','DOTNETCORE|3.1','DOTNETCORE|LTS','DOTNETCORE|Latest'])
param linuxFxVersion string

@description('The url to the repository to be deployed to the Server. ')
param repositoryUrl string

@description('The repositoryToken. ')
param repositoryToken string 

@description('The branch of the repository to use. TODO: this should depend on what branch was checked in.')
param repositoryBranch string = 'main'

@description('The folder within the repository that contains the source code of the service. ')
param repositorySourceLocation string = '/'



// ------------------------------------------------------------
// 
// ------------------------------------------------------------
var tmp = empty(projectServiceName) ? '_':'_${projectServiceName}_'
var fullName = '${projectName}${tmp}${environmentId}' 
var shortName = projectName
//var uniqueSuffix = uniqueString(resourceGroup().id)
var groupResourceName =  toUpper(sharedSettings.namingConventions.parentNameIsLonger ?  fullName : shortName)
var parentResourceName = toUpper(sharedSettings.namingConventions.parentNameIsLonger ? fullName : shortName)
var childResourceName =  toUpper(sharedSettings.namingConventions.parentNameIsLonger ? shortName : fullName)
var defaultTags = {project: projectName, service: projectServiceName, environment: environmentId}
var useTags = union(resourceTags, defaultTags)
// ------------------------------------------------------------
// 
// ------------------------------------------------------------


module resourceGroupsModule '../microsoft/resources/resourcegroups.bicep' = {
  name:  '${deployment().name}_resourcegroups_module'
  scope: subscription()
   // pass parameters:
  params: {
    resourceName: groupResourceName
    resourceLocationId: groupResourceLocationId
    resourceTags: useTags

  }
}


module serverFarmsModule '../microsoft/web/serverfarms.bicep' = {
  // should be implied: 
  // dependsOn: [resourceGroupsModule]
  name:  '${deployment().name}_serverfarms_module'
  scope: resourceGroup() 
  params: {
    resourceName: parentResourceName
    resourceLocationId: serverfarmsResourceLocationId
    resourceTags: useTags

    webAppServicePlanSKU: webAppServicePlanSKU
  }
}

module sitesModule '../microsoft/web/sites.bicep' = {
  // should be implied: 
  dependsOn: [serverFarmsModule]
  // pass parameters:
  name:  '${deployment().name}_sites_module'
  scope: resourceGroup()
  params: {
    parentResourceId: serverFarmsModule.outputs.resourceId

    resourceName: '${childResourceName}${uniqueString( resourceGroupId(subscription().id,groupResourceName) )}')

    resourceLocationId: sitesResourceLocationId
    resourceTags: useTags

    linuxFxVersion: linuxFxVersion
  }
}

module srcControlsModule '../microsoft/web/sites/sourcecontrols.bicep' = {
  // dependsOn: 
  // [appSitesModule]
  name:  '${deployment().name}_sites_sourcecontrols_module'
  scope: sitesModule  
  params: {
    resourceName:  '${sitesModule.outputs.resourceName}/web'
    resourceLocationId: sourcecontrolsResourceLocationId
    resourceTags: useTags

    repositoryUrl: repositoryUrl
    repositoryToken: repositoryToken
    repositoryBranch: repositoryBranch
    repositorySourceLocation: repositorySourceLocation
  }
}

output resourceId string = sitesModule.outputs.resourceId
output resourceName string = sitesModule.outputs.resourceName
// param sink (to not cause error if param is not used):
output _ bool = startsWith('${resourceLocationId}', 'z')
