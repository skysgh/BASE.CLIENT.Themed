// targetScope='subscription'

// ------------------------------------------------------------
// ------------------------------------------------------------

// Resources Groups are part of the general subscription
@description('Whether to name parent resources (e.g. resourceGroups, serverfarms, etc.) as with service and env names, or the other way around.')
param parentNameIsLonger bool = true;

// Resources Groups are part of the general subscription
@description('The project name. This informs automation of naming of resource groups, services, etc. e.g.: \'BASE\'')
param projectName string

@description('The project service name. Name used to build resources. e.g.: \'SERVICE\'')
param projectServiceName string = ''

@allowed ('NP','BT', 'DT','ST','UT','IT','TR','PP','PR')
param environmentId string;

@description('The location for this resource. ')
param resourceLocationId string = resourceGroup().location;

@description('The tags for this resource. ')
param resourceTags object = {}

@description('The SKU of the app service plan. ')
param webAppServicePlanSKU string = 'F1' // The SKU of App Service Plan

@description('The Function eXtension to define the runtime stack. Default = \'DOTNETCORE|Latest\'')
@allowed('DOTNETCORE|2.2','DOTNETCORE|3.0','DOTNETCORE|3.1','DOTNETCORE|LTS','DOTNETCORE|Latest')
param linuxFxVersion string = 'DOTNETCORE|Latest'

@description('The url to the repository to be deployed to the Server. ')
param repositoryUrl string

@description('The branch of the repository to use. TODO: this should depend on what branch was checked in.')
param repositoryBranch string = 'main'

@description('The folder within the repository that contains the source code of the service. ')
param repositorySourceLocation string = '/'

var appServicePlanName = toLower('AppServicePlan-${webAppName}')
var webSiteName = toLower('wapp-${webAppName}')

// Sort out default name, location and resources.
var fullName = concat('${projectName},${projectServiceName}?:'_':'',${projectServiceName},'_',${environmentId}');
var shortName = projectName;
var parentResourceName = toUpper(parentNameIsLonger?fullName:shortName)
var childResourceName = toUpper(parentNameIsLonger?shortName:fullName)
var defaultTags = {'project':projectName,'service':projectServiceName, 'environment':environmentId}
var useTags = union(resourceTags, defaultTags);



resource resourceGroupModule './microsoft/resources/resourcegroups.bicep' = {
   // pass parameters:
  params: {
    resourceName: parentResourceName
    resourceLocationId: resourceLocationId
    resourceTags:resourceTags
  }
}


resource appServicePlanModule './microsoft/web/serverfarms.bicep' = {
  // should be implied: 
  // dependsOn: [resourceGroupModule]
  scope: resourceGroupModule.outputs.name 
  params: {
    resourceName: parentResourceName
    resourceLocationId: resourceLocationId
    resourceTags:resourceTags
  }
}

module appSitesModule './microsoft/web/sites.bicep' = {
  // should be implied: 
  // dependsOn: [appServicePlanModule]
  // pass parameters:
  params: {
    parentResourceId: appServicePlanModule.outputs.resourceId

    resourceName: childResourceName
    resourceLocationId: resourceLocationId
    resourceTags:resourceTags
  
    linuxFxVersion: linuxFxVersion
  }
}

module srcControlsModule './microsoft/web/sites/sourcecontrols.bicep' = {
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

output resourceId  = appSitesModule.outputs.id
output resourceName  = appSitesModule.outputs.name
