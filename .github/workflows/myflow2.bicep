targetScope='subscription'

param projectName string
param environmentId string

param resourceLocation string

module rgModule 'resource-group.bicep' = {
  // name: '${deployment().name}'
  name: '${deployment().name}_X0'
  params: {
    resourceGroupName: '${projectName}_${environmentId}'
    resourceGroupLocation: resourceLocation
  }
}
