

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
@allowed([ 'global'])
param resourceLocation3 string = 'global'

@description('Options are \'Free\' and \'Standard\'. Default is \'Free\'.')
@allowed([ 'Free', 'Standard' ])
param resourceSku string = 'Free'

@description('URL for the repository of the static site.')
param repositoryUrl string = ''

@description('The branch within the repository. Default is \'main\'.')
param repositoryBranch string = 'main'

//var rgResourceId = rgModule.outputs.resourceId

module rgModule 'resource-group.bicep' = {
  name: '${deployment().name}_rg'
  // Don't knnow if this needed at this level?
  scope: subscription()
  params: {
    resourceName: '${projectName}_${environmentId}'
    resourceLocation: resourceLocation
  }
}

// could pick up the output id from before as:
// id: rgModule.outputs.resourceId

module swaModule 'static-web-app.bicep' = {
  dependsOn: [rgModule] // Specify a dependency on the rgModule
  name: '${deployment().name}_swa'
  scope: rgModule
  // scope: rgResourceId
   // scope: resourceGroup(subscription().id, rgModule.outputs.resourceId)
    // alt way: scope: resourceGroup(rgModule.outputs.resourceName) // Specify the resource group as the scope
  params: {
    resourceName: projectName
    resourceLocation: resourceLocation3
    resourceSku: resourceSku
    repositoryUrl: repositoryUrl
    repositoryBranch: repositoryBranch
  }
}
