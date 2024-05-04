using './main.bicep'

param projectName='BASALT' 
param environmentId='BT' 
param resourceLocation='${{ vars.AZURE_LOCATION_1_ID }}' 
param repositoryUrl='https://github.com/skysgh/BASE.Jump.Dev.Client.Themed.git'
param repositoryToken=${{secrets.GITHUB_TOKEN}} 
param appBuildCommand='npm install && npm run build' 
param appLocation='SOURCE/App.Service.Client.Web/' 
param outputLocation='dist/base'
