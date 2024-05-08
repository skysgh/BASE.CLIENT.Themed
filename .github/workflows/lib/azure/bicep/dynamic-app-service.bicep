// targetScope='subscription'

// ------------------------------------------------------------
// ------------------------------------------------------------
// Resources Groups are part of the general subscription
@description('The name of the project. This informs automation of naming of resource groups, services, etc. e.g.: \'BASE\'')
param projectName string

@description('The name used to build resources. e.g.: \'SERVICE\'')
param projectServiceName string = ''

@allowed ('NP','BT', 'DT','ST','UT','IT','TR','PP','PR')
param environmentId string;

@description('The default location for resources. ')
param resourceLocationId string;

@description('The SKU of the app service plan. ')
param webAppServicePlanSKU string = 'F1' // The SKU of App Service Plan


@description('The Function eXtension to define the runtime stack. Default = \'DOTNETCORE|Latest\'')
@allowed(  'DOTNETCORE|2.2','DOTNETCORE|3.0','DOTNETCORE|3.1','DOTNETCORE|LTS','DOTNETCORE|Latest')
param linuxFxVersion string = 'DOTNETCORE|Latest'

param location string = resourceGroup().location // Location for all resources


@description('The url to the repository to be deployed to the Server. ')
param repositoryUrl string

@description('The branch of the repository to use. TODO: this should depend on what branch was checked in.')
param repositoryBranch string = 'main'

@description('The folder within the repository that contains the source code of the service. ')
param repositorySourceLocation string = '/'

var appServicePlanName = toLower('AppServicePlan-${webAppName}')
var webSiteName = toLower('wapp-${webAppName}')

var resourceGroupName = toUpper('${projectName}_${projectServiceName}_${environmentId}')

var resourceGroupName = toUpper('${projectName}_{$environmentId}')

var defaultResourceName = toLower('${projectName}')


resource appServicePlanModule './microsoft/web/serverfarms.bicep' = {
  name: resourceGroupName
  resourceLocation: resourceLocation
}

resource appServiceModule './microsoft/web/sites.bicep' = {
  dependsOn: [appServicePlanModule]
  parentResourceId: appServicePlanModule.outputs.resourceId
  resourceLocation: resourceLocation
  linuxFxVersion: linuxFxVersion
}

resource srcControls './microsoft/web/sites/sourcecontrol.bicep' = {
    dependsOn: [appServicePlanModule, appServiceModule]
    name:  '${appServiceModule.outputs.resourceName}/web'
    repositoryUrl: repositoryUrl
    repositoryBranch: repositoryBranch
}

