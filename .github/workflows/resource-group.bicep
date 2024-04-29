targetScope='subscription'

param resourceGroupName string required
param resourceGroupLocation string required

resource newRG 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: resourceGroupName
  location: resourceGroupLocation
}
