// See:
// https://learn.microsoft.com/en-us/azure/templates/microsoft.web/staticsites?pivots=deployment-language-bicep

targetScope='resourcegroup'

param projectName string

param resourceName string

@allowed([ 'Free', 'Standard' ])
param sku string = 'Free'



@description("Note: can't be: 'resourceGroup().location'")
@allowed([ 'global'])
param resourceLocation string = 'global'


@description("The path to the app code within the repository.")
paran appLocation string = "/"

@description("The path to the api code within the repository.")
param apiLocation string = ""

@description("The output path of the app after building.")
param outputLocation string = './output'


@description("A custom command to run during deployment of the static content application.")
param appBuildCommand string = ''

@description("A custom command to run during deployment of the Azure Functions API application.")
apiBuildCommand string = ''


@description("	Whether or not the newly generated repository is a private repository. Defaults to false (i.e. public).")
isPrivate string = false

@description("URL for the repository of the static site.")
repositoryUrl string = ''

@description("A user's github repository token. This is used to setup the Github Actions workflow file and API secrets.")
repositoryToken string = ''

@description("The target branch in the repository.")
branch string = ''



resource resource 'Microsoft.Web/staticSites@2022-09-01' = {
  name: resourceName
  location: resourceLocation
  tags: {
    tagName1: 'tagValue1'
    tagName2: 'tagValue2'
  }
  sku: {
    capabilities: [
      {
        name: 'string'
        reason: 'string'
        value: 'string'
      }
    ]
    capacity: int
    family: 'string'
    locations: [
      'string'
    ]
    name: 'string'
    size: 'string'
    skuCapacity: {
      default: int
      elasticMaximum: int
      maximum: int
      minimum: int
      scaleType: 'string'
    }
    tier: 'string'
  }
  kind: 'string'
  identity: {
    type: 'string'
    userAssignedIdentities: {}
  }
  properties: {
    allowConfigFileUpdates: bool
    branch: 'string'
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
    enterpriseGradeCdnStatus: 'string'
    provider: 'string'
    publicNetworkAccess: 'string'
    repositoryToken: repositoryToken
    repositoryUrl: repositoryUrl
    stagingEnvironmentPolicy: 'string'
    templateProperties: {
      description: 'string'
      isPrivate: bool
      owner: 'string'
      repositoryName: 'string'
      templateRepositoryUrl: 'string'
    }
  }
}


// return the id of the newly created resource:
output resourceId string = resource.id
