// Sub part of Sites (which is a sub part of ServerFarms)


@description('the unique name of site.')
param resourceName string 

@description('The id of the resource for the site.')
// @allowed('')
param resourceLocationId string

@description('The Url of the repository containing source code of this site.')
param repositoryUrl string

@description('The Branch of the repository containing source code of this site.')
param repositoryBranch string

@description('The Branch of the repository containing source code of this site.')
param repositoryBranch string

@description('.')
param isManualIntegration boolean = true


var partResourceName = '${resourceName}/web'

resource srcControls 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  name: partResourceName
  properties: {
    repoUrl: repositoryUrl
    branch: repositoryBranch

    // Not sure what this is:
    isManualIntegration: isManualIntegration
  }
}
