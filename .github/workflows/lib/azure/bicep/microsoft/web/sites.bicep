// ======================================================================
// Scope
// ======================================================================
// Scope is parent resourceGroup:
targetScope='resourceGroup'

// ======================================================================
// Import Shared Settings
// ======================================================================
var sharedSettings = loadJsonContent('../../settings/shared.json')

// ======================================================================
// Default Name, Location, Tags,
// ======================================================================
@description('Id of parent app Service Plan. eg: \'appServicePlanModule.id\'')
param parentResourceId string

@description('the unique name of this site (often is PROJECTNAME + a unique number).')
param resourceName string

@description('The id of the resource for the site.')
// @allowed('')
param resourceLocationId string

@description('The tags to merge for this resource.')
param resourceTags object = {}
// ======================================================================
// Default SKU, Kind, Tier where applicable
// ======================================================================


// ======================================================================
// Resource other Params
// ======================================================================
@description('The Function eXtension to define the runtime stack. Default = \'DOTNETCORE|Latest\'')
@allowed(['DOTNETCORE|2.2','DOTNETCORE|3.0','DOTNETCORE|3.1','DOTNETCORE|LTS','DOTNETCORE|Latest'])
param linuxFxVersion string = 'DOTNETCORE|Latest'



// ======================================================================
// Default Variables: useResourceName, useTags
// ======================================================================
var useTags = union(resourceTags,sharedSettings.defaultTags)

// ======================================================================
// Resource bicep
// ======================================================================
resource resource 'Microsoft.Web/sites@2020-06-01' = {
  name: resourceName
  location: resourceLocationId
  tags: useTags
  
  properties: {
    serverFarmId: parentResourceId
    siteConfig: {
      linuxFxVersion: linuxFxVersion
    }
  }
}

// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
// Provide ref to developed resource:
output resource object = resource
// return the id (the fully qualitified name) of the newly created resource:
output resourceId string = resource.id
// return the (short) name of the newly created resource:
output resourceName string = resource.name
// param sink (to not cause error if param is not used):
output _ bool = startsWith(concat('${sharedSettings.version}'), '.')
