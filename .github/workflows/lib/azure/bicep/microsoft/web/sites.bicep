@description('Id of parent app Service Plan. eg: 'appServicePlanModule.id')
param parentResourceId string;

@description('the unique name of this site (often is PROJECTNAME + a unique number).')
param resourceName string

@description('The id of the resource for the site.')
// @allowed('')
param resourceLocationId string

@description('The tags to merge for this resource.')
param resourceTags array = []

resource appServiceModule 'Microsoft.Web/sites@2020-06-01' = {
  name: resourceName
  location: resourceLocationId
  //
  properties: {
    // tie it in by referencing parent servicePlan:
    serverFarmId: appServicePlanModule.id
    siteConfig: {
      linuxFxVersion: linuxFxVersion
    }
  }
}
