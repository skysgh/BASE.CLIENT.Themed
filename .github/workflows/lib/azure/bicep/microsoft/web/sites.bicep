// var sharedSettings = loadJsonContent('../../../settings/shared.json')

// Scope is parent resourceGroup:
targetScope='resourceGroup'

@description('Id of parent app Service Plan. eg: \'appServicePlanModule.id\'')
param parentResourceId string

@description('the unique name of this site (often is PROJECTNAME + a unique number).')
param resourceName string

@description('The id of the resource for the site.')
// @allowed('')
param resourceLocationId string

@description('The tags to merge for this resource.')
param resourceTags object = {}

@description('The Function eXtension to define the runtime stack. Default = \'DOTNETCORE|Latest\'')
@allowed(['DOTNETCORE|2.2','DOTNETCORE|3.0','DOTNETCORE|3.1','DOTNETCORE|LTS','DOTNETCORE|Latest'])
param linuxFxVersion string = 'DOTNETCORE|Latest'


resource resource 'Microsoft.Web/sites@2020-06-01' = {
  name: resourceName
  location: resourceLocationId
  tags: resourceTags
  
  properties: {
    serverFarmId: parentResourceId
    siteConfig: {
      linuxFxVersion: linuxFxVersion
    }
  }
}


// return the id (the fully qualitified name) of the newly created resource:
output resourceId string = resource.id

// return the (short) name of the newly created resource:
output resourceName string = resource.name

// param sink (to not cause error if param is not used):
output _ bool = startsWith('', 'z')
