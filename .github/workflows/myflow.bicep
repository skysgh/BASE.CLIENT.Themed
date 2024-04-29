targetScope='subscription'

param projectName string
param environmentId string

param resourceLocation string
param resourceLocation2 string
param resourceLocation3 string

module stgModule 'resource-group.bicep' = {
  // name: '${deployment().name}'
  name: '${deployment().name}'
  scope: subscription // resourceGroup('demoRG')
  params: {
    resourceGroupName: projectName
    resourceGroupLocation: resourceLocation
  }
}
