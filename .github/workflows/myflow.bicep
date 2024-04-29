targetScope='subscription'

param projectName string
param environmentId string

param resourceLocation string

module stgModule 'resource-group.bicep' = {
  // name: '${deployment().name}'
  name: '${deployment().name}'
  params: {
    resourceGroupName: '${projectName}_${environmentId}'
    resourceGroupLocation: resourceLocation
  }
}
