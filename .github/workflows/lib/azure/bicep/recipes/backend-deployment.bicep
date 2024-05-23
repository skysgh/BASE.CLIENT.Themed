// ======================================================================
// Background
// ======================================================================
// There is a Free version of Sql Server that offers 100,000 seconds of
// CPU (a little more than a day). 
// But I don't yet know how to create it via Bicep.

// ======================================================================
// Resources
// ======================================================================
//
//

// ======================================================================
// Scope
// ======================================================================
//targetScope='resourceGroup'// NO: it stops resourceGroup().location from working: 'subscription'
targetScope='subscription'

// ======================================================================
// Import Shared Settings
// ======================================================================
var sharedSettings = loadJsonContent('../settings/shared.json')


// ======================================================================
// Flow Control
// ======================================================================
// Resources Groups are part of the general subscription
@description('Whether to build the ResourceGroup or not.')
param buildResourceGroup bool = true


// ======================================================================
// Default Name, Location, Tags,
// ======================================================================
// Resources Groups are part of the general subscription
@description('The name used to build resources. e.g.: \'BASE\'')
@maxLength(11) // Limited by storageAccount name length (24) minus 13 chars for uniqueString(...)
param projectName string

@description('The name used to build resources. e.g.: \'CLIENT\'')
param projectServiceName string = ''

@description('The id of the environment, to append to the name of resource groups. e.g.: \'BT\'')
@allowed([ 'NP',   'BT','DT','ST','UT','IT','PP','TR','PR'])
param environmentId string
// ------------------------------------------------------------
// ------------------------------------------------------------
@description('The tags for this resource. ')
param resourceTags object = {}


// ======================================================================
// Params: Resource Group Specific
// ======================================================================
@description('The lowercase Name of the  Resource Group in whch these resources are built. Recommend it be upperCase of \'${projectName}-${serviceName}-${envId}\'')
param resourceGroupName string = toUpper('${projectName}-${projectServiceName}-${environmentId}')

@description('The Location Id of the Resource Group.')
//TooManyOptions @allowed([ 'australiacentral'])
param resourceGroupLocationId = defaultLocationId

@description('Any resource specific tags.')
param resourceGroupTags object = {}

// ======================================================================
// Params: Resource Defaults 
// ======================================================================
@description('The default name of resources.')
param defaultResourceName string = toLower(projectName)

@description('The default location Id of resources.')
//TooManyOptions @allowed([ 'australiacentral'])
param defaultResourceLocationId string

@description('The default tags for objects.')
param defaultResourceTags object = {}
// ======================================================================
// Params: Web Farms
// ======================================================================
@description('Name of web server farm. Do not add unique suffix as it will be added later.')
param webServerFarmsResourceName = toLower(defaultResourceName)

@description('The Location Id of the Web Server. Default is set to \'defaultResourceLocationId\'. ')
//TooManyOptions @allowed([ 'australiacentral'])
param webServerFarmsResourceLocationId = defaultResourceLocationId

@description('The tags for the resource.')
param webServerFarmsResourceTags object = {}

@description('The web app service plan SKU. Options are: F1,D1,B1,B2,S1,S2. Default: D1 (as F1 can only be used once, and hence needs monitoring).')
@allowed(['F1','D1','B1','B2','S1','S2'])
param webServerFarmsServicePlanSKU = 'D1'

// ======================================================================
// Params: Web Sites
// ======================================================================
@description('The Name of the site on the server farm. Do not add unique suffix as it is not needed to be universally unique.')
param webSitesResourceName string = toLower(defaultResourceName)

@description('The location of the site. Default is set to \'webServerfarmsResourceLocationId\', which is by default same as \'defaultResourceLocationId\'.')
param webSitesResourceLocationId string = webServerfarmsResourceLocationId

@description('The Function eXtension to define the runtime stack. Default is \'DOTNETCORE|Latest\' but best be specific to not get caught out if .net.core releases a version that you are in compatible with.')
@allowed(['DOTNETCORE|2.2','DOTNETCORE|3.0','DOTNETCORE|3.1','DOTNETCORE|LTS','DOTNETCORE|Latest'])
param webSitesLinuxFxVersion string

@description('The tags for the resource.')
param webSitesTags object = {}
// ======================================================================
// Params: Web Sites SourceControls
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
// Params: SourceControl
// ======================================================================
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
// Vars
// ======================================================================

// ======================================================================
// Resource bicep: ResourceGroup
// ======================================================================

module resourceGroupsModule '../microsoft/resources/resourcegroups.bicep' = if (buildResourceGroup) {
   // pass parameters:
  name:  '${deployment().name}_resourceGroups_module'
  scope:subscription()
  params: {
    resourceName: resourceGroupName
    resourceLocationId: resourceGroupLocationId
    resourceTags: union(defaultTags, resourceGroupTags)
  }
}

// ======================================================================
// Resource bicep: Server
// ======================================================================

module resourceGroupsModule './web-dynamic-app-deploy.bicep' = {
  name:  '${deployment().name}_web_recipe_module'
  scope:subscription()
  params: {
    defaultResourceName   : projectName
    defaultResourceLocationId     : defaultLocationId
    defaultResourceTags   : defaultTags
    // Resource:
    webServerFarmsResourceName = webServerFarmsResourceName
    webServerFarmsresourceLocationId = webServerFarmsResourceLocationId
    webServerFarmsResourceTags = webServerFarmsResourceTags
    // 
    webServerFarmsServicePlanSKU = webServerFarmsServicePlanSKU
    // Resource:
    webSitesResourceName = webSitesResourceName
    webSitesResourceLocationId = webSitesResourceLocationId
    webSitesResourceTags = webSitesResourceTags
    // 
    webSitesLinuxFxVersion = webSitesLinuxFxVersion
    // Resource:
    webSitesSourceControlsResourceName = webSitesResourceName
    webSitesSourceControlsLocationId = webSitesLocationId
    webSitesSourceControlsResourceTags = webSitesResourceTags
    // 
    webSitesSourceControlsRepositoryUrl = webSitesSourceControlsRepositoryUrl
    webSitesSourceControlsRepositoryToken = webSitesSourceControlsRepositoryToken
    webSitesSourceControlsRepositoryBranch = webSitesSourceControlsRepositoryBranch
    webSitesSourceControlsRepositorySourceLocation = webSitesSourceControlsRepositorySourceLocation
  }
}
