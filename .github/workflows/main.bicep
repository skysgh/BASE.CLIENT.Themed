// Don't knnow if this needed at this level?
targetScope='subscription'

@description("The name used to build resources. e.g.: 'BASE'")
param projectName string

@description("The id of the environment, to append to the name of resource groups. e.g.: 'BT'")
@allowed([ 'BT','DT','ST','UT','IT','PR'])
param environmentId string

@description("The lowercase identifier of where to build the resource Group. Default is 'australiacentral'.")
@allowed([ 'australiacentral'])
param resourceLocation string = 'australiacentral'

@description("The lowercase identifier of where to build the resource Group if resourceLocation is not available. Default is ' southeastasia'.")
@allowed([ 'southeastasia'])
param resourceLocation2 string = 'southeastasia'

@description("The lowercase identifier of where to build the resource Group if resourceLocation2 is not available. Default is 'global'.")
@allowed([ 'global'])
param resourceLocation3 string = 'global'

@allowed([ 'Free', 'Standard' ])
param sku string = 'Free'


module rgModule 'resource-group.bicep' = {
  // name: '${deployment().name}'
  name: '${deployment().name}_X0'
  params: {
    resourceGroupName: '${projectName}_${environmentId}'
    resourceGroupLocation: resourceLocation
  }
}

// could pick up the output id from before as:
// id: rgModule.outputs.resourceId

module swaModule 'static-web-app.bicep' = {
  name: '${deployment().name}'
  scope: resourceGroup(resourceGroupName)
  params: {
    scope: resourceGroup(subscription().id, rgModule.outputs.resourceId)
    // alt way: scope: resourceGroup(rgModule.outputs.resourceGroupName) // Specify the resource group as the scope
    resourceName: '${projectName}'
    resourceLocation: resourceLocation
  }
}