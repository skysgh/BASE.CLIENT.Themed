@description('The name for the resource (serverFarms). IMPORTANT: Note that it may have one or more nested servers under it. ')
param resourceName string;

@description('Location of the resource.')
//@allowed([ ''])
param resourceLocation string;

@description('Tags to merge in.')
param resourceTags array = [];


resource symbolicname 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: resourceName
  location: resourceLocation
//  tags: {
//    tagName1: 'tagValue1'
//    tagName2: 'tagValue2'
//  }
//  sku: {
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
//    name: 'string'
//    size: 'string'
//    skuCapacity: {
//      default: int
//      elasticMaximum: int
//      maximum: int
//      minimum: int
//      scaleType: 'string'
//    }
//    tier: 'string'
//  }
//  kind: 'string'
//   extendedLocation: {
//    name: 'string'
//  }
//  properties: {
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
//    reserved: bool
//    spotExpirationTime: 'string'
//    targetWorkerCount: int
//    targetWorkerSizeId: int
//    workerTierName: 'string'
//    zoneRedundant: bool
  }
}
