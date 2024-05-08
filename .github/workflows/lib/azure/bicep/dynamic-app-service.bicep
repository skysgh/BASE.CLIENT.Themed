// targetScope='subscription'

// ------------------------------------------------------------
// ------------------------------------------------------------
// Resources Groups are part of the general subscription
@description('The name of the project. This informs automation of naming of resource groups, services, etc. e.g.: \'BASE\'')
param projectName string

@description('The name used to build resources. e.g.: \'SERVICE\'')
param projectServiceName string = ''

@allowed ('NP','BT', 'DT','ST','UT','IT','TR','PP',PR')
param environmentId string;

@description('The default location for resources. ')
param resourceLocation string;

@description('The SKU of the app service plan. ')
param webAppServicePlanSKU string = 'F1' // The SKU of App Service Plan

param linuxFxVersion string = 'node|14-lts' // The runtime stack of web app

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
}

resource appServiceModule 'Microsoft.Web/sites@2020-06-01' = {
  name: defaultResourceName
  location: resourceLocation
  //
  properties: {
    // tie it in by referencing parent servicePlan:
    serverFarmId: appServicePlanModule.id
    siteConfig: {
      linuxFxVersion: linuxFxVersion
    }
  }
}

resource srcControls 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  // References parent module:
  name: '${appServiceModule.name}/web'
  // 
  properties: {
    repoUrl: repositoryUrl
    branch: repositoryBranch
    isManualIntegration: true
  }
}
