var sharedSettings = loadJsonContent('../../../settings/shared.json')

// Scope is parent resourceGroup:
targetScope='resourceGroup'

// Resource that is required to be set up before
// instantiating (and associating to it) a 
// server

@description('The name for the resource (serverFarms). IMPORTANT: Note that it may have one or more nested servers under it. ')
param resourceName string

@description('Location of the resource.')
// @allowed([ ''])
param resourceLocationId string

@description('Tags to merge in.')
param resourceTags object = {}

@description('The type of OS.')
// @allowed([ ''])
param serverKind string = 'linux'

@description('The service plan SKU')
@allowed(['F1','D1','B1','B2','S1','S2'])
param webAppServicePlanSKU string = 'F1'

resource resource 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: resourceName
  location: resourceLocationId
  tags: resourceTags
  sku: {
//    capabilities: [
//      {
//        name: 'string'
//        reason: 'string'
//        value: 'string'
//      }
//    ]
//    capacity: int
//    family: 'string'
//    locations: [
//      'string'
//    ]
    name: webAppServicePlanSKU
//    size: 'string'
//    skuCapacity: {
//      default: int
//      elasticMaximum: int
//      maximum: int
//      minimum: int
//      scaleType: 'string'
//    }
//    tier: 'string'
  }
  kind: serverKind
//   extendedLocation: {
//    name: 'string'
//  }
  properties: {
//    elasticScaleEnabled: bool
//    freeOfferExpirationTime: 'string'
//    hostingEnvironmentProfile: {
//      id: 'string'
//    }
//    hyperV: bool
//    isSpot: bool
//    isXenon: bool
//    kubeEnvironmentProfile: {
//      id: 'string'
//    }
//    maximumElasticWorkerCount: int
//    perSiteScaling: bool
    reserved: true
//    spotExpirationTime: 'string'
//    targetWorkerCount: int
//    targetWorkerSizeId: int
//    workerTierName: 'string'
//    zoneRedundant: bool
  }
}


// return the id (the fully qualitified name) of the newly created resource:
output resourceId string = resource.id

// return the (short) name of the newly created resource:
output resourceName string = resource.name

// param sink (to not cause error if param is not used):
output _ bool = startsWith(concat(''), 'z')
