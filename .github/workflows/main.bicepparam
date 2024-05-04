using './main.bicep'

param projectName=  readEnvironmentVariable('PROJECT_NAME')
param environmentId = readEnvironmentVariable('ENVIRONMENT_ID')
param resourceLocation = readEnvironmentVariable('AZURE_LOCATION_1_ID')
param repositoryUrl = 'https://github.com/skysgh/BASE.Jump.Dev.Client.Themed.git'
param repositoryToken = ${{secrets.GITHUB_TOKEN}} 
param appBuildCommand = 'npm install && npm run build' 
param appLocation = 'SOURCE/App.Service.Client.Web/' 
param outputLocation = 'dist/base'



