
// Resources Groups are part of the general subscription
targetScope='subscription'

@description('The name used to build resources. e.g.: \'BASE\'')
param projectName string

@description('The id of the environment, to append to the name of resource groups. e.g.: \'BT\'')
@allowed([ 'BT','DT','ST','UT','IT','PR'])
param environmentId string

@description('The lowercase identifier of where to build the resource Group. Default is \'australiacentral\'.')
@allowed([ 'australiacentral'])
param resourceLocation string = 'australiacentral'

// @description('The lowercase identifier of where to build the resource Group if resourceLocation is not available. Default is \'southeastasia\'.')
// @allowed([ 'southeastasia'])
// param resourceLocation2 string = 'southeastasia'

@description('The lowercase identifier of where to build the resource Group if resourceLocation2 is not available. Default is \'global\'.')
@allowed([ 'eastasia'])
param resourceLocation3 string = 'eastasia'

@description('Options are \'Free\' and \'Standard\'. Default is \'Free\'.')
@allowed([ 'Free', 'Standard' ])
param resourceSku string = 'Free'

@description('A user\'s github repository token. This is used to setup the Github Actions workflow file and API secrets. e.g.: use secrets.GITHUB_TOKEN')
param repositoryToken string = ''

@description('Location of app source code in repo')
param appLocation string = '/SOURCE/App.Service.Client.Web'

@description('The path to the api source code relative to the root of the repository.')
param apiLocation string = ''

@description('A custom command to run during deployment of the static content application.e.g. \'npm run build\'')
param appBuildCommand string = 'npm run build'

@description('The output path of the app after building the app source code found in \'appLocation\'. For an angular app that might be something like \'dist/xxx/\' ')
param outputLocation string = 'dist/base'

@description('URL for the repository of the static site.')
param repositoryUrl string = ''

@description('The branch within the repository. Default is \'main\'.')
param repositoryBranch string = 'main'

resource rg1 'Microsoft.Resources/resourceGroups@2022-09-01' = {
    name: '${projectName}_${environmentId}'
    location: resourceLocation
}

// module rgModule 'resource-group.bicep' = {
//  name: '${deployment().name}_rg'
//  // Don't knnow if this needed at this level?
//  scope: subscription()
//  params: {
//    resourceName: '${projectName}_${environmentId}'
//    resourceLocation: resourceLocation
//  }
// }

// could pick up the output id from before as:
// id: rgModule.outputs.resourceId

module swaModule 'static-web-app.bicep' = {
  //dependsOn: [rg1] // Specify a dependency on the rgModule
  name: '${deployment().name}_swa'
  scope: rg1
  // scope: rgResourceId
   // scope: resourceGroup(subscription().id, rgModule.outputs.resourceId)
    // alt way: scope: resourceGroup(rgModule.outputs.resourceName) // Specify the resource group as the scope
  params: {
    resourceName: projectName
    resourceLocation: resourceLocation3
    resourceSku: resourceSku
    
    repositoryUrl: repositoryUrl
    repositoryBranch: repositoryBranch
    repositoryToken: repositoryToken
    
    appLocation: appLocation
    appBuildCommand:appBuildCommand
    apiLocation: apiLocation
    
    outputLocation: outputLocation
  }
}
