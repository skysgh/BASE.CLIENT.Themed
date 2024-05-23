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
@description('The name of the resource group in which to create resources. ')
param resourceGroupName string

// ======================================================================
// Default Settings  
// ======================================================================
@description('The location of resources. ')
// @allowed(...too long...)
param defaultResourceName string 

@description('The location of resources. ')
param defaultResourceNameSuffix string = '' 

@description('The location of resources. ')
// @allowed(...too long...)
param defaultResourceLocationId string 

@description('The tags for this resource. ')
param defaultResourceTags object = {}
// ======================================================================
// Params: Server Farm 
// ======================================================================
@description('The name of the serverFarm to which site is deployed.')
param serverfarmsResourceName string = toLower('${defaultResourceName}${defaultResourceNameSuffix}') 

@description('The location of the serverFarm.')
// @allowed(...too long...)
param serverfarmsResourceLocationId string  = defaultResourceLocationId 

@description('The web app service plan SKU. Options are: F1,D1,B1,B2,S1,S2. Default: D1 (as F1 can only be used once, and hence needs monitoring).')
@allowed(['F1','D1','B1','B2','S1','S2'])
param serverFarmsServicePlanSKU string = 'D1'

// ======================================================================
// Params: Sites 
// ======================================================================
@description('The Name of the site on the server farm.')
param sitesResourceName string = toLower('${defaultResourceName}${defaultResourceNameSuffix}')

@description('The location of the site. Default is same as server farm.')
param sitesResourceLocationId string = serverfarmsResourceLocationId

@description('The Function eXtension to define the runtime stack. Default is \'DOTNETCORE|Latest\' but best be specific to not get caught out if .net.core releases a version that you are in compatible with.')
@allowed(['DOTNETCORE|2.2','DOTNETCORE|3.0','DOTNETCORE|3.1','DOTNETCORE|LTS','DOTNETCORE|Latest'])
param sitesLinuxFxVersion string

// ======================================================================
// Params: SourceControl
// ======================================================================
@description('The url to the repository to be deployed to the Server. Default is empty string (\'\'). ')
param sourceControlsRepositoryUrl string = ''

@description('The repositoryToken if repositoryUrl is set. Default is empty string (\'\').')
@secure()
param sourceControlsRepositoryToken string = ''

@description('The branch of the repository to use. TODO: this should depend on what branch was checked in. Default is \'main\'.')
param sourceControlsRepositoryBranch string = 'main'

@description('The folder within the repository that contains the source code of the service. Default is root (\'/\') - but often needs to be set to a sub folder (eg: \'src\').')
param sourceControlsRepositorySourceLocation string = '/'
// ======================================================================
// Default Variables
// ======================================================================
var uniqueSuffix = uniqueString(resourceGroupName)
var sourceCountrolsSetupFlag = startsWith(sitesRepositoryUrl, 'http')
// Whatever is given, it's not relevant:
var useSitesResourceName = '${sitesResourceName}-${uniqueSuffix}'
// ======================================================================
// Resource bicep: ServerFarm
// ======================================================================

module serverFarmsModule '../microsoft/web/serverfarms.bicep' = {
  name:  '${deployment().name}_serverfarms_module'
  scope: resourceGroup(resourceGroupName) 
  params: {
    resourceName               : serverFarmsResourceName
    resourceLocationId         : serverfarmsResourceLocationId
    resourceTags               : useTags

    resourceSKU                : serverFarmsServicePlanSKU
  }
}
// ======================================================================
// Resource bicep: Sites
// ======================================================================
module sitesModule '../microsoft/web/sites.bicep' = {
  // depends on the 
  // pass parameters:
  name:  '${deployment().name}_sites_module'
  scope: resourceGroup(resourceGroupName) 
  params: {
    // Implicit dependence:
    parentResourceId           : serverFarmsModule.outputs.resourceId

    resourceName               : useSitesResourceName
    resourceLocationId         : sitesResourceLocationId
    resourceTags               : useTags
    // Specific:
    linuxFxVersion             : sitesLinuxFxVersion
  }
}
// ======================================================================
// Resource bicep: Sites/SourceControls
// ======================================================================
module srcControlsModule '../microsoft/web/sites/sourcecontrols.bicep' = if (sourceCountrolsSetupFlag) {
  dependsOn: [sitesModule]
  name:  '${deployment().name}_sites_sourcecontrols_module'
  scope: resourceGroup(resourceGroupName) 
  // child resources don't use 'scope', they use 'parent':
  // parent: sitesModule  
  params: {
    // Same name as parent site:
    resourceName               : useSitesResourceName //  sitesModule.outputs.resourceName 
    resourceLocationId         : sourceControlsResourceLocationId
    resourceTags               : useTags

    // No SKU or similar

    repositoryUrl              : sourceControlsRepositoryUrl
    repositoryToken            : sourceControlsRepositoryToken
    repositoryBranch           : sourceControlsRepositoryBranch
    repositorySourceLocation   : sourceControlsRepositorySourceLocation
  }
}

// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
output resource object = sitesModule.outputs.resource
output resourceId string = sitesModule.outputs.resourceId
output resourceName string = sitesModule.outputs.resourceName
// param sink (to not cause error if param is not used):
output _ bool = startsWith('${sharedSettings.version}=${resourceLocationId}', '.')
