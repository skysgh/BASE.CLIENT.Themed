// ======================================================================
// Scope
// ======================================================================
//targetScope='resourceGroup'// NO: it stops resourceGroup().location from working: 'subscription'
// NO. It stops resourceLocation().location from working: 
// targetScope='subscription'
// NO:targetScope='resourceGroup'
targetScope='subscription'

// ======================================================================
// Import Shared Settings
// ======================================================================
var sharedSettings = loadJsonContent('../settings/shared.json')

// ======================================================================
// Parent Resource Group  
// ======================================================================
@description('The name of the resource group in which to create these resources. ')
@minLength(3)
param resourceGroupName string

// ======================================================================
// Default Settings  
// ======================================================================
@description('The default name of resources.')
@minLength(3)
param defaultResourceName string 

@description('The default suffix of resouces, appended to defaultResourceName.')
param defaultResourceNameSuffix string = uniqueString(toUpper(resourceGroupName)) 

@description('The default location of resources. ')
// @allowed(...too long...)
param defaultResourceLocationId string 

@description('The tags for this resource. ')
param defaultResourceTags object = {}
// ======================================================================
// Params: Server Farm 
// ======================================================================
@description('The name of the serverFarm to which site is deployed. Required to be universally unique (\'defaultResourceNameSuffix\' will be appended later)')
param webServerfarmsResourceName string = toLower(defaultResourceName) 

@description('The location of the serverFarm.')
// @allowed(...too long...)
param webServerfarmsResourceLocationId string  = defaultResourceLocationId 

@description('The web app service plan SKU. Options are: F1,D1,B1,B2,S1,S2. Default: D1 (as F1 can only be used once, and hence needs monitoring).')
@allowed(['F1','D1','B1','B2','S1','S2'])
param webServerFarmsServicePlanSKU string = 'D1'

@description('The tags for this resource.')
param webServerFarmsResourceTags object = {}
// ======================================================================
// Params: Sites 
// ======================================================================
@description('The Name of the site on the server farm. Does not need to be universally unique.')
param webSitesResourceName string = toLower(defaultResourceName)

@description('The location of the site. Default is same as server farm.')
param webSitesResourceLocationId string = webServerfarmsResourceLocationId

@description('The tags for this resource.')
param webSitesResourceTags object = {}

@description('The Function eXtension to define the runtime stack. Default is \'DOTNETCORE|Latest\' but best be specific to not get caught out if .net.core releases a version that you are in compatible with.')
@allowed(['DOTNETCORE|2.2','DOTNETCORE|3.0','DOTNETCORE|3.1','DOTNETCORE|LTS','DOTNETCORE|Latest'])
param webSitesLinuxFxVersion string

// ======================================================================
// Params: Web Sites SourceControl
// ======================================================================
@description('The Name of the site on the server farm. Does not need to be universally unique.')
param webSitesSourceControlsResourceName string = toLower(webSitesResourceName)

@description('The location of the site. Default is same as server farm.')
param webSitesSourceControlsResourceLocationId string = toLower(webSitesResourceLocationId)

@description('The tags for this resource.')
param webSitesSourceControlsResourceTags object = {}

@description('The url to the repository to be deployed to the Server. Default is empty string (\'\'). ')
param webSitesSourceControlsRepositoryUrl string = ''

@description('The repositoryToken if repositoryUrl is set. Default is empty string (\'\').')
@secure()
param webSitesSourceControlsRepositoryToken string = ''

@description('The branch of the repository to use. TODO: this should depend on what branch was checked in. Default is \'main\'.')
param webSitesSourceControlsRepositoryBranch string = 'main'

@description('The folder within the repository that contains the source code of the service. Default is root (\'/\') - but often needs to be set to a sub folder (eg: \'src\').')
param webSitesSourceControlsRepositorySourceLocation string = '/'
// ======================================================================
// CLEANUP & VARS
// ======================================================================
defaultResourceTags = union(defaultResourceTags,sharedSettings.defaultTags)

var webSitesSourceCountrolsSetupFlag = startsWith(webSitesSourceControlsRepositoryUrl, 'http')
// ======================================================================
// Resource bicep: ServerFarm
// ======================================================================

module webServerFarmsModule '../microsoft/web/serverfarms.bicep' = {
  name:  '${deployment().name}_serverfarms_module'
  scope: resourceGroup(resourceGroupName) 
  params: {
    resourceName               : toLower('${webServerFarmsResourceName}${defaultResourceNameSuffix}')
    resourceLocationId         : webServerfarmsResourceLocationId
    resourceTags               : union(defaultResourceTags, webServerFarmsResourceTags)

    resourceSKU                : webServerFarmsServicePlanSKU
  }
}
// ======================================================================
// Resource bicep: Sites
// ======================================================================
module webSitesModule '../microsoft/web/sites.bicep' = {
  // depends implicitely on the 
  // [webServerFarmsModule]
  // pass parameters:
  name:  '${deployment().name}_sites_module'
  scope: resourceGroup(resourceGroupName) 
  params: {
    // Implicit dependence:
    parentResourceId           : webServerFarmsModule.outputs.resourceId
    //
    resourceName               : toLower(webSitesResourceName)
    resourceLocationId         : webSitesResourceLocationId
    resourceTags               : union(defaultResourceTags, webSitesResourceTags)
    //
    linuxFxVersion             : webSitesLinuxFxVersion
  }
}
// ======================================================================
// Resource bicep: Sites/SourceControls
// ======================================================================
module webSitesSourceControlsModule '../microsoft/web/sites/sourcecontrols.bicep' = if (webSitesSourceCountrolsSetupFlag) {
  dependsOn: [webSitesModule]
  name:  '${deployment().name}_sites_sourcecontrols_module'
  scope: resourceGroup(resourceGroupName) 
  // child resources don't use 'scope', they use 'parent':
  // parent: webSitesModule  
  params: {
    resourceName               : toLower(webSitesSourceControlsResourceName) //  sitesModule.outputs.resourceName      // Note: Same name as parent site:
    resourceLocationId         : webSitesSourceControlsResourceLocationId
    resourceTags               : union(defaultResourceTags, webSitesSourceControlsResourceTags)
    //
    repositoryUrl              : webSitesSourceControlsRepositoryUrl
    repositoryToken            : webSitesSourceControlsRepositoryToken
    repositoryBranch           : webSitesSourceControlsRepositoryBranch
    repositorySourceLocation   : webSitesSourceControlsRepositorySourceLocation
  }
}

// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
output resource object = webSitesModule.outputs.resource
output resourceId string = webSitesModule.outputs.resourceId
output resourceName string = webSitesModule.outputs.resourceName
// param sink (to not cause error if param is not used):
output _ bool = startsWith('${sharedSettings.version}=${defaultResourceLocationId}', '.')
