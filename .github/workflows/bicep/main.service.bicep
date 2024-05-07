@description('The name of the project. This informs automation of naming of resource groups, services, etc.')
param projectName string

@description('The name of this project's service. This informs automation of naming of resource groups, services, etc.')
param projectServiceName string

@description('The name of the project environment. This informs automation of naming of resource groups, services, etc.')
@allowed ('NP','BT', 'DT','ST','UT','IT','PP','TR','PR')
param environmentId string;

//@description('The default tags to merge in.')
//param resourceTags array = []

@description('The default location for resources. ')
param resourceLocation string;

@description('The first fallback default location for resources. ')
param resourceLocation2 string = resourceLocation;

@description('The first fallback default location for resources. ')
param resourceLocation3 string = resourceLocation2;

param webAppName string = uniqueString(resourceGroup().id) // Generate unique String for web app name


@description('The SKU of the app service plan. ')
param webAppServicePlanSKU string = 'F1' // The SKU of App Service Plan

param linuxFxVersion string = 'node|14-lts' // The runtime stack of web app

param location string = resourceGroup().location // Location for all resources


var resourceGroupName = toUpper('${projectName}_{$environmentId}')
var defaultResourceName = toLower('${projectName}')

@description('The url to the repository to be deployed to the Server. ')
param repositoryUrl string = 'https://github.com/Azure-Samples/nodejs-docs-hello-world'

@description('The branch of the repository to use. TODO: this should depend on what branch was checked in.')
param repositoryBranch string = 'main'

@description('The folder within the repository that contains the source code of the service. ')
param repositorySourceLocation string = '/'

var appServicePlanName = toLower('AppServicePlan-${webAppName}')
var webSiteName = toLower('wapp-${webAppName}')


resource appServicePlanModule 'Microsoft.Web/serverfarms@2020-06-01' = {
  name: defaultResourceName
  location: resourceLocation
  properties: {
    reserved: true
  }
  sku: {
    name: webAppServicePlanSKU
  }
  kind: 'linux'
}

resource appServiceModule 'Microsoft.Web/sites@2020-06-01' = {
  name: defaultResourceName
  location: resourceLocation
  properties: {
    serverFarmId: appServicePlanModule.id
    siteConfig: {
      linuxFxVersion: linuxFxVersion
    }
  }
}

resource srcControls 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  name: '${appServiceModule.name}/web'
  properties: {
    repoUrl: repositoryUrl
    branch: repositoryBranch
    isManualIntegration: true
  }
}
