// ======================================================================
// Background
// ======================================================================
// There is a Free version of Sql Server that offers 100,000 seconds of
// CPU (a little more than a day). 
// But I don't yet know how to create it via Bicep.

// ======================================================================
// Resources
// ======================================================================
// https://blog.robsewell.com/blog/flexing-my-bicep-deploy-an-azure-sql-database-intro-to-azure-bicep-iac/

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

@description('Build the resoure. For testing, can be set to false')
param buildResource bool = true

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
// ------------------------------------------------------------
// ------------------------------------------------------------
@description('The lowercase identifier of where to build the resource Group. Default is \'australiacentral\'.')
//TooBig @allowed([ 'australiacentral'])
param resourceGroupLocationId string //NO. Fails 'resourceGroup().location' if scope is subscriptoin.




// ======================================================================
// Default Variables: useResourceName, useTags
// ======================================================================

// Use formatting. And cleanup if service name not used. There is no trim('_') unfortunately.
var tmp1 = (empty(projectServiceName) ? '':format(sharedSettings.namingConventions.namingPartFormat, projectServiceName))
var tmp2 = (empty(environmentId)      ? '':format(sharedSettings.namingConventions.namingPartFormat, environmentId))
var fullName = replace(format(sharedSettings.namingConventions.namingFormat, projectName, tmp1,tmp2),'__','_') 
var shortName = projectName

var useResourceGroupName =  toUpper(sharedSettings.namingConventions.parentNameIsLonger ?  fullName : shortName)
var useResourceGroupLocation = resourceGroupLocationId

var useTags = union(resourceTags, defaultTags)

// ======================================================================
// Resource bicep
// ======================================================================
module resourceGroupsModule '../microsoft/resources/resourcegroups.bicep' = if (buildResource) {
  name:  '${deployment().name}_resourcegroups_module'
  scope: subscription()
  params: {
    resourceName: useResourceGroupName
    resourceLocationId: useResourceGroupLocation
    resourceTags: useTags
  }
}
// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
output resourceId string = resourceGroupModule.outputs.resourceId
output resourceName string = resourceGroupModule.outputs.resourceName
output resourceUniqueString string = resourceGroupModule.outputs.resourceUniqueString
