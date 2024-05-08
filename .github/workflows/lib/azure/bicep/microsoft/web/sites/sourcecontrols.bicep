resource srcControls 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  // References parent module:
  name: '${appServiceModule.name}/web'
  // 
  properties: {
    repoUrl: repositoryUrl
    branch: repositoryBranch
    isManualIntegration: true
  }
}
