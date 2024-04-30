targetScope='subscription'

param projectName string
param environmentId string

@description("The lowercase identifier of where to build the resource Group. Default is 'australiacentral'.")
@allowed([ 'australiacentral'])
param resourceLocation string = 'australiacentral'

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

module staticWebApp 'static-web-app.bicep' = {
  name: '${deployment().name}'
  scope: resourceGroup(resourceGroupName)
  params: {
    resourceName: '${projectName}_${environmentId}'
    resourceLocation: resourceLocation
  }
}
