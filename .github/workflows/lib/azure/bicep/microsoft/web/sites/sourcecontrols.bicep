// Sub part of Sites (which is a sub part of ServerFarms)


@description('the unique name of site.')
param resourceName string 

@description('The id of the resource for the site. NOT USED.')
// @allowed('') 
param resourceLocationId string = ''

@description('The tags for this resource. ')
param resourceTags object = {}

@description('The Url of the repository containing source code of this site.')
param repositoryUrl string

@description('The Branch of the repository containing source code of this site.')
param repositoryBranch string

@description('The folder within repo containing the source code.')
repositorySourceLocation string = '/'

@description('.')
param isManualIntegration bool = true


var useResourceName = '${resourceName}/web'

resource resource 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  name: useResourceName
  // location: resourceLocationId
  // tags: useTags

  properties: {
    repoUrl: repositoryUrl
    branch: repositoryBranch

    // Not sure what this is:
    isManualIntegration: isManualIntegration
  }
}


// return the id (the fully qualitified name) of the newly created resource:
output resourceId string = resource.id

// return the (short) name of the newly created resource:
output resourceName string = resource.name

// param sink (to not cause error if param is not used):
output _ = startsWith(concat(), 'z')
