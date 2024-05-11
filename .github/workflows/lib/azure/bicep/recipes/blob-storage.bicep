// ------------------------------------------------------------
// ------------------------------------------------------------
var sharedSettings = loadJsonContent('../settings/shared.json')
// ------------------------------------------------------------
// ------------------------------------------------------------
targetScope='subscription'
// ------------------------------------------------------------
// ------------------------------------------------------------
// Resources Groups are part of the general subscription
@description('The project name. This informs automation of naming of resource groups, services, etc. e.g.: \'BASE\'')
param projectName string

@description('The project service name. Name used to build resources. e.g.: \'SERVICE\'')
param projectServiceName string = 'SERVICE'

@allowed (['NP','BT', 'DT','ST','UT','IT','TR','PP','PR'])
param environmentId string
// ------------------------------------------------------------
// ------------------------------------------------------------
@description('The tags for this resource. ')
param resourceTags object = {}
// ------------------------------------------------------------
// ------------------------------------------------------------
@description('The location of the parent resource group. ')
// @allowed(...too long...)
param resourceLocationId string //Note: cannot do when targetScope='subscription': resourceGroup().location
// ------------------------------------------------------------
// ------------------------------------------------------------

