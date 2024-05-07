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


@description('The SKU of the App Service plan. ')
// Careful. Expensive.  
// F[1]=1CPU, 1Gb,32bit!!! 60 minutes per day!!! No Custom Domain
// D[1]=1CPU, 0.5Gb,32bit!!! Custom Domain.
// B[1,2,3] [1,2,4]CPU, 10GB, 64 bit, Custom Domains, SSL (SNI SSL only), [$55/m,$111/m,$223/m]
// S[1,2,3]=[1,2,4] CPU,1.75Gb, 50GB, [$73/m,$146/m, $297/m]
// P[1,2,3]=[1,2,4] CPU,1.75Gb, 250GB, [$223/m,$446/m,$892/m]
@allowed ('F1','D1','B1','B2', 'S1','S2') // Do not allow as that makes no sense: 'B3','S3','P1','P2','P3'
param webAppServicePlanSKU string = 'F1'


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
