// Resources Groups are part of the general subscription
targetScope='subscription'

@description("Required. The name of the resource Group.")
param resourceName string

@description("The lowercase identifier of where to build the resource Group. Default is 'australiacentral'.")
// will allow more later.
@allowed([ 'australiacentral'])
param resourceLocation string = 'australiacentral'


resource newRG 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: resourceName
  location: resourceLocation
}


output resourceId string = newRG.id
