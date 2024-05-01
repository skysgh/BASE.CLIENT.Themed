// See:
// https://learn.microsoft.com/en-us/azure/templates/microsoft.web/staticsites?pivots=deployment-language-bicep

// Resources are part of a parent resource group:
targetScope='resourceGroup'


@description('Required. The name of the resource.Tip: usually there is only one resource, set the same as the project name, with only the name of the Resource Group being different per Environment.')
param resourceName string

// ie, can't be: 'resourceGroup().location'
@description('SWAs are deployed globally, so there really is no option.')
@allowed([ 'centralus', 'eastus2', 'eastasia', 'westeurope', 'westus2' ])
param resourceLocation string = 'eastasia'

@description('The SKU to use.')
@allowed([ 'Free', 'Standard' ])
param resourceSku string = 'Free'

@description('The path to the app source code relative to the root of the repository. Probably sonmething like \'SRC/\' or similar.')
param appLocation string = '/'

@description('The path to the api source code relative to the root of the repository.')
param apiLocation string = ''

@description('The output path of the app after building the app source code found in \'appLocation\'. For an angular app that might be something like \'dist/xxx/\' ')
param outputLocation string = './output'


@description('A custom command to run during deployment of the static content application.e.g. \'npm run build\'')
param appBuildCommand string = ''

@description('A custom command to run during deployment of the Azure Functions API application.')
param apiBuildCommand string = ''


// @description('Whether or not the newly generated repository is a private repository. Defaults to false (i.e. public).')
// param isPrivate string = false

@description('URL for the repository of the static site.')
param repositoryUrl string

@description('The target branch in the repository.')
param repositoryBranch string = 'main'

@description('A user\'s github repository token. This is used to setup the Github Actions workflow file and API secrets.')
@secure()
param repositoryToken string = null

resource resource 'Microsoft.Web/staticSites@2022-09-01' = {
  name: resourceName
  location: resourceLocation
  // tags: {
  //  tagName1: 'tagValue1'
  //  tagName2: 'tagValue2'
  //}
  sku: {
    // capabilities: [
    //  {
    //    name: resourceSku
    //    // reason: 'string'
    //    value: resourceSku
    //  }
    // ]
    // capacity: int
    // family: 'string'
    //locations: [
    //  'string'
    //]
     name: resourceSku
    // size: 'string'
    // skuCapacity: {
    //  default: int
    //  elasticMaximum: int
    //  maximum: int
    //  minimum: int
    //  scaleType: 'string'
    //}
    tier: resourceSku
  }
  // kind: 'string'
 // identity: {
  //  type: 'string'
  //  userAssignedIdentities: {}
  //}
  properties: {
    // allowConfigFileUpdates: bool
    branch: repositoryBranch
    buildProperties: {
      apiLocation: apiLocation
      // appArtifactLocation: 'string'
      apiBuildCommand: apiBuildCommand
      appBuildCommand: appBuildCommand
      // The path to the app code within the repository.
      appLocation: appLocation
      // githubActionSecretNameOverride: 'string'
      outputLocation: outputLocation
      // skipGithubActionWorkflowGeneration: bool
    }
    // enterpriseGradeCdnStatus: 'string'
    // provider: 'string'
    publicNetworkAccess: 'Enabled'
    repositoryToken: repositoryToken
    repositoryUrl: repositoryUrl
    // stagingEnvironmentPolicy: 'string'
    // templateProperties: {
    //  description: 'string'
    //  isPrivate: bool
    //  owner: 'string'
    //  repositoryName: 'string'
    //  templateRepositoryUrl: 'string'
    // }
  }
}


// return the id (the fully qualitified name) of the newly created resource:
output resourceId string = resource.id
// return the (short) name of the newly created resource:
output resourceName string = resource.name
