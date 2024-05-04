using './main.bicep'

projectName='BASALT' 
environmentId='BT' 
resourceLocation='${{ vars.AZURE_LOCATION_1_ID }}' 
repositoryUrl='https://github.com/skysgh/BASE.Jump.Dev.Client.Themed.git'
repositoryToken=${{secrets.GITHUB_TOKEN}} 
appBuildCommand='npm install && npm run build' 
appLocation='SOURCE/App.Service.Client.Web/' 
outputLocation='dist/base'
