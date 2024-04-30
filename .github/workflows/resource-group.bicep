// Resources Groups are part of the general subscription
targetScope='subscription'

@description('Required. The name of the resource Group.')
param resourceName string

@description('The lowercase identifier of where to build the resource Group. Default is \'australiacentral\'.')
// will allow more later.
@allowed([ 'australiacentral'])
param resourceLocation string = 'australiacentral'


// Creating new resource groups take a little bit of time
resource resource 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: resourceName
  location: resourceLocation
}

// return the id (the fully qualitified name) of the newly created resource:
output resourceId string = resource.id
// return the (short) name of the newly created resource:
output resourceName string = resource.name
