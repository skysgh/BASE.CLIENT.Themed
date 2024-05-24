// ======================================================================
// Background
// ======================================================================
// A resonable set of resources that use resources as a service, 
// not trying to solve it in an older lan based way.

// ======================================================================
// Description
// ======================================================================
// Deployment KeyVault.
// Runtime KeyVault.
// Web ServerFarm.
// Web Site on the server farm.  Develops an MSI...
// Registers the MSI as having rights to Key vault
// Sql Server (using Db Admin Username/Key) 
// Sql Server Db 
// Storage account
// Sql Storage Backup

// ======================================================================
// Dependencies
// ======================================================================
// The Github repo has at least two secrets (Db Admin User Name/pwd)
//
// The following are required:
// projectName
// projectServiceName
// environmentId
// defaultResourceLocationId
// sqlServerAdminUserName
// sqlServerAdminPassword
//
// The following have defaults, but worth considering first:
// sqlServerDbCollation
// sqlServerDbSampleName
// sqlServerDbUseFreeLimit
// sqlServerDbFreeLimitExhaustionBehavior
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
param projectServiceName string

@description('The id of the environment, to append to the name of resource groups. e.g.: \'BT\'.')
@allowed([ 'NP',   'BT','DT','ST','UT','IT','PP','TR','PR'])
param environmentId string

// ======================================================================
// Params: Resource Defaults 
// ======================================================================
@description('The default name of resources.')
param defaultResourceName string = toLower(projectName)

@description('The default location Id of resources.')
//TooManyOptions @allowed(['australiacentral'])
param defaultResourceLocationId string

@description('The tags shared across all resources.')
param defaultResourceTags object = {} // { project: projectName, service: projectServiceName, environment: environmentId }

// ======================================================================
// Params: Resource Group Specific (Only IF built here)
// ======================================================================
@description('The upper case Name of the Resource Group in whch these resources are built. Recommend it be the default, which is the upperCase of \'projectName-serviceName-envId\'.')
param resourceGroupName string = replace( toUpper('${projectName}-${projectServiceName}-${environmentId}'),'--','-')

@description('The Location Id of the Resource Group.')
//TooManyOptions @allowed(['australiacentral'])
param resourceGroupLocationId string = defaultResourceLocationId

@description('Tags to use if developing the Resource Group.')
param resourceGroupTags object = defaultResourceTags

// ======================================================================
// Params: Web Farms
// ======================================================================
@description('Name of web server farm. Do not add unique suffix as it will be added later.')
param webServerFarmsResourceName string = toLower(defaultResourceName)

@description('The Location Id of the Web Server. Default is set to \'defaultResourceLocationId\'.')
//TooManyOptions @allowed(['australiacentral'])
param webServerFarmsResourceLocationId string = defaultResourceLocationId

@description('The tags for the resource.')
param webServerFarmsResourceTags object = defaultResourceTags

@description('The web app service plan SKU. Options are: F1,D1,B1,B2,S1,S2. Default: D1 (as \'F1\' can only be used once, and hence needs monitoring).')
@allowed(['F1','D1','B1','B2','S1','S2'])
param webServerFarmsResourceSKU string = 'D1'

// ======================================================================
// Params: Web Sites
// ======================================================================
@description('The Name of the site on the server farm. Do not add unique suffix as it is not needed to be universally unique.')
param webSitesResourceName string = toLower(defaultResourceName)

@description('The location of the site. Default is set to \'webServerFarmsResourceLocationId\', which is by default same as \'defaultResourceLocationId\'.')
param webSitesResourceLocationId string = webServerFarmsResourceLocationId

@description('The tags for the resource.')
param webSitesResourceTags object = defaultResourceTags

@description('The Function eXtension to define the runtime stack. Default is \'DOTNETCORE|Latest\' but best be specific to not get caught out if .net.core releases a version that you are in compatible with.')
@allowed(['DOTNETCORE|2.2','DOTNETCORE|3.0','DOTNETCORE|3.1','DOTNETCORE|LTS','DOTNETCORE|Latest'])
param webSitesLinuxFxVersion string

// ======================================================================
// Params: Web Sites SourceControls
// ======================================================================
@description('The Name of the site on the server farm. Does not need to be universally unique.')
param webSitesSourceControlsResourceName string = toLower(webSitesResourceName)

@description('The location of the site. Default is same as server farm.')
param webSitesSourceControlsResourceLocationId string = toLower(webSitesResourceLocationId)

@description('The tags for this resource.')
param webSitesSourceControlsResourceTags object = defaultResourceTags

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
// Params: Sql Server 
// ======================================================================
@description('The name of the sql server. Default is lower case of \'defaultResourceName\'.  Required to be universally unique (\'defaultResourceNameSuffix\' will be appended later).')
param sqlServerResourceName string = toLower(defaultResourceName) 

@description('Location of Resource. Default is \'defaultResourceLocationId\'.')
//TOO Big: @allowed([ 'australiacentral'])
param sqlServerResourceLocationId string  = defaultResourceLocationId

@description('The tags for this resource.')
param sqlServerResourceTags object = defaultResourceTags

@description('TODO:...: Default is: \'SystemAssigned,UserAssigned\' permitting creation using dbms admin user name & pwd, and later AAD sourced service account.')
@allowed(['None', 'SystemAssigned', 'SystemAssigned,UserAssigned', 'UserAssigned'])
param sqlServerIdentityType string = 'SystemAssigned,UserAssigned'

@description('The minimal TLS Version to use. Default is \'1.3\'.')
@allowed(['1.2','1.3'])
param sqlServerMinimalTlsVersion string = '1.3'

@description('An Admin User\'s Name, to create the DB in the first place. Source from a pipeline environment Secret or pipeline accessible keyvault.')
@minLength(3)
@maxLength(128)
@secure()
param sqlServerAdminUserName string 

@description('An Admin User\'s Pwd, to create the DB in the first place. Source from a pipeline environment Secret or pipeline accessible keyvault. Must have 3 of 4 of [a-z], [A-Z], [0-9], or [specialchars]')
@minLength(8)
@maxLength(128)
@secure()
param sqlServerAdminPassword string 

// ======================================================================
// Params: Sql Server Database  
// ======================================================================

@description('Name of database. Default is set to lowercase of \'sqlServerResourceName\'. Not required to be globally unique.')
param sqlServerDbResourceName string = toLower(sqlServerResourceName)

@description('Location of Database. Default is set to \'sqlServerResourceLocationId\'.')
//TOO Big: @allowed([ 'australiacentral'])
param sqlServerDbResourceLocationId string = sqlServerResourceLocationId

@description('The tags for this resource.')
param sqlServerDbResourceTags object = defaultResourceTags

@description('The SKU of this resource.The default is \'Basic\' to save costs.')
// @allowed(['Basic', 'StandardS0', 'StandardS1', 'StandardS2', 'StandardS3', 'StandardS4', 'StandardS6', 'StandardS7', 'StandardS9', 'StandardS12', 'PremiumP1', 'PremiumP2', 'PremiumP4', 'PremiumP6', 'PremiumP11', 'PremiumP15', 'GP_Gen5_2', 'GP_Gen5_4', 'GP_Gen5_8', 'GP_Gen5_16', 'GP_Gen5_24', 'GP_Gen5_32', 'GP_Gen5_40', 'GP_Gen5_80', 'GP_Gen4_2', 'GP_Gen4_4', 'GP_Gen4_8', 'GP_Gen4_16', 'BC_Gen5_2', 'BC_Gen5_4', 'BC_Gen5_8', 'BC_Gen5_16', 'BC_Gen5_24', 'BC_Gen5_32', 'BC_Gen5_40', 'BC_Gen5_80', 'BC_Gen4_2', 'BC_Gen4_4', 'BC_Gen4_8', 'BC_Gen4_16'])
@allowed(['Basic', 'S0', 'S1', 'S2', 'S3', 'S4', 'PremiumP1', 'PremiumP2', 'PremiumP4', 'GP_Gen5_2', 'GP_Gen5_4', 'GP_Gen4_2', 'GP_Gen4_4', 'BC_Gen5_2', 'BC_Gen5_4', 'BC_Gen4_2', 'BC_Gen4_4'])
param sqlServerDbResourceSKU string = 'Basic'

@description('The Tier of this resource. The default is \'Basic\' to save costs.')
@allowed(['Basic', 'Standard', 'Premium', 'GeneralPurpose', 'BusinessCritical'])
//param sqlServerDbResourceTier string = (contains(['Basic', 'StandardS0', 'StandardS1', 'StandardS2', 'StandardS3', 'StandardS4', 'StandardS6', 'StandardS7', 'StandardS9', 'StandardS12'], sqlServerDbResourceSKU) ? 'Standard': (contains(['PremiumP1', 'PremiumP2', 'PremiumP4', 'PremiumP6', 'PremiumP11', 'PremiumP15'], sqlServerDbResourceSKU) ? 'Premium': (contains(['GP_Gen5_2', 'GP_Gen5_4', 'GP_Gen5_8', 'GP_Gen5_16', 'GP_Gen5_24', 'GP_Gen5_32', 'GP_Gen5_40', 'GP_Gen5_80', 'GP_Gen4_2', 'GP_Gen4_4', 'GP_Gen4_8', 'GP_Gen4_16'], sqlServerDbResourceSKU) ? 'GeneralPurpose': (contains(['BC_Gen5_2', 'BC_Gen5_4', 'BC_Gen5_8', 'BC_Gen5_16', 'BC_Gen5_24', 'BC_Gen5_32', 'BC_Gen5_40', 'BC_Gen5_80', 'BC_Gen4_2', 'BC_Gen4_4', 'BC_Gen4_8', 'BC_Gen4_16'], sqlServerDbResourceSKU) ? 'BusinessCritical' : 'Basic'))))
param sqlServerDbResourceTier string = (contains(['Basic', 'S0', 'S1', 'S2', 'S3', 'S4'], sqlServerDbResourceSKU) ? 'Standard': (contains(['PremiumP1', 'PremiumP2', 'PremiumP4'], sqlServerDbResourceSKU) ? 'Premium': (contains(['GP_Gen5_2', 'GP_Gen5_4', 'GP_Gen4_2', 'GP_Gen4_4'], sqlServerDbResourceSKU) ? 'GeneralPurpose': (contains(['BC_Gen5_2', 'BC_Gen5_4', 'BC_Gen4_2', 'BC_Gen4_4'], sqlServerDbResourceSKU) ? 'BusinessCritical' : 'Basic'))))

@description('Time *in minutes* after which database is automatically paused. A value of \'-1\' means that automatic pause is disabled. Default: 120 (2 hours).')
param sqlServerDbAutoPauseDelay int = 120

@description('Specifies the availability zone the database is pinned to.	Default is\'NoPreference\'.')
@allowed(['1', '2', '3', 'NoPreference'])
param sqlServerDbAvailabilityZone string = 'NoPreference'

@description('If the DB is free (one per subscription, then what do to when passing free offer. Default: \'BillOverUsage\'. See: \'sqlServerDbUseFreeLimit\'.')
@allowed(['AutoPause', 'BillOverUsage'])
param sqlServerDbFreeLimitExhaustionBehavior string = 'BillOverUsage'

@description('	Collation of the metadata catalog.. Default is \'DATABASE_DEFAULT\' (which is by default \'Latin1_General_CI_AS\').')
@allowed(['DATABASE_DEFAULT', 'SQL_Latin1_General_CP1_CI_AS', 'Latin1_General_CI_AS'])
param sqlServerDbCatalogCollation string = 'DATABASE_DEFAULT'

@description('	Collation of the metadata catalog. Default is \'Latin1_General_CI_AS\'. (US is \'SQL_Latin1_General_CP1_CI_AS\', NZ-English is \'Latin1_General_CI_AS\', Maori is \'Latin1_General_CI_AI\').')
@allowed(['SQL_Latin1_General_CP1_CI_AS', 'Latin1_General_CI_AS'])
param sqlServerDbCollation string = 'Latin1_General_CI_AS'

@description('Creation Mode.. Default is \'Default\'.')
@allowed(['Copy', 'Default', 'OnlineSecondary', 'PointInTimeRestore', 'Recovery', 'Restore', 'RestoreExternalBackup', 'RestoreExternalBackupSecondary', 'RestoreLongTermRetentionBackup', 'Secondary'])
param sqlServerDbCreateMode string = 'Default'

@description('Whether the database is a Ledger one, permitting to review historical values. Default is \'true\'.')
param sqlServerDbIsLedgerOn bool = true

@description('Name of Sample database schema to develop . Default is \'\'.')
@allowed(['', 'AdventureWorksLT', 'WideWorldImportersFull', 'WideWorldImportersStd'])
param sqlServerDbSampleName string = ''

@description('Whether or not the database uses free monthly limits. Allowed on one database in a subscription. See \'sqlServerDbFreeLimitExhaustionBehavior\'.')
param sqlServerDbUseFreeLimit bool = false

@description('Whether or not this database is zone redundant, which means the replicas of this database will be spread across multiple availability zones. Default: false')
param sqlServerDbZoneRedundant bool = false

// ======================================================================
// CLEANUP OF VARS
// ======================================================================


// ======================================================================
// Resource bicep: ResourceGroup
// ======================================================================

module resourceGroupsModule '../microsoft/resources/resourcegroups.bicep' = if (buildResourceGroup) {
   // pass parameters:
  name:  '${deployment().name}-rg'
  scope:subscription()
  params: {
    resourceGroupName: resourceGroupName
    resourceGroupLocationId: resourceGroupLocationId
    resourceGroupTags: union(resourceGroupTags, defaultResourceTags, sharedSettings.defaultTags)
  }
}

// ======================================================================
// Resource bicep: Server
// ======================================================================

module webSiteModule './web-dynamic-app-deployment.bicep' = if (buildResource) {
  dependsOn: [resourceGroupsModule]
  name:  '${deployment().name}-web-recipe'
  scope:subscription()
  params: {
    // -----
    resourceGroupName                               : resourceGroupName
    // -----
    defaultResourceName                             : projectName
    defaultResourceLocationId                       : defaultResourceLocationId
    defaultResourceTags                             : defaultResourceTags
    // -----
    webServerFarmsResourceName                      : webServerFarmsResourceName
    webServerFarmsResourceLocationId                : webServerFarmsResourceLocationId
    webServerFarmsResourceTags                      : union( webServerFarmsResourceTags, defaultResourceTags, sharedSettings.defaultTags)
    // 
    webServerFarmsResourceSKU                       : webServerFarmsResourceSKU
    // -----
    webSitesResourceName                            : webSitesResourceName
    webSitesResourceLocationId                      : webSitesResourceLocationId
    webSitesResourceTags                            : webSitesResourceTags
    // 
    webSitesLinuxFxVersion                          : webSitesLinuxFxVersion
    // -----
    webSitesSourceControlsResourceName              : webSitesResourceName
    webSitesSourceControlsResourceLocationId        : webSitesResourceLocationId
    webSitesSourceControlsResourceTags              : union(webSitesSourceControlsResourceTags, defaultResourceTags, sharedSettings.defaultTags)
    // 
    webSitesSourceControlsRepositoryUrl             : webSitesSourceControlsRepositoryUrl
    webSitesSourceControlsRepositoryToken           : webSitesSourceControlsRepositoryToken
    webSitesSourceControlsRepositoryBranch          : webSitesSourceControlsRepositoryBranch
    webSitesSourceControlsRepositorySourceLocation  : webSitesSourceControlsRepositorySourceLocation
  }
}


// ======================================================================
// Resource bicep: Server
// ======================================================================

module sqlServerModule './sql-server-deployment.bicep' = if (buildResource) {
  dependsOn: [webSiteModule]
  name:  '${deployment().name}-rdms-recipe'
  scope:subscription()
  params: {
    // -----
    resourceGroupName                        : resourceGroupName
    // -----
    defaultResourceName                      : projectName
    defaultResourceLocationId                : defaultResourceLocationId
    defaultResourceTags                      : defaultResourceTags
    // -----
    sqlServerResourceName                    : sqlServerResourceName
    sqlServerResourceLocationId              : sqlServerResourceLocationId
    sqlServerResourceTags                    : union(sqlServerResourceTags, defaultResourceTags, sharedSettings.defaultTags)
    sqlServerIdentityType                    : sqlServerIdentityType
    sqlServerMinimalTlsVersion               : sqlServerMinimalTlsVersion
    sqlServerAdminUserName                   : sqlServerAdminUserName
    sqlServerAdminPassword                   : sqlServerAdminPassword 
    // -----
    sqlServerDbResourceName                  : sqlServerDbResourceName
    sqlServerDbResourceLocationId            : sqlServerDbResourceLocationId
    sqlServerDbResourceTags                  : union(sqlServerDbResourceTags, defaultResourceTags, sharedSettings.defaultTags)
    //    
    sqlServerDbResourceSKU                   : sqlServerDbResourceSKU
    sqlServerDbResourceTier                  : sqlServerDbResourceTier
    //
    sqlServerDbAutoPauseDelay                : sqlServerDbAutoPauseDelay
    sqlServerDbFreeLimitExhaustionBehavior   : sqlServerDbFreeLimitExhaustionBehavior
    sqlServerDbAvailabilityZone              : sqlServerDbAvailabilityZone
    sqlServerDbCatalogCollation              : sqlServerDbCatalogCollation
    sqlServerDbCollation                     : sqlServerDbCollation
    sqlServerDbCreateMode                    : sqlServerDbCreateMode
    sqlServerDbIsLedgerOn                    : sqlServerDbIsLedgerOn
    sqlServerDbSampleName                    : sqlServerDbSampleName
    sqlServerDbUseFreeLimit                  : sqlServerDbUseFreeLimit
    sqlServerDbZoneRedundant                 : sqlServerDbZoneRedundant
  }
}




// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
// Provide ref to developed resource:
//output resource object = xxx.outputs.resource
// return the id (the fully qualitified name) of the newly created resource:
//output resourceId string = resource.id
// return the (short) name of the newly created resource:
//output resourceName string = resource.name
// param sink (to not cause error if param is not used):
output _ bool = startsWith('${sharedSettings.version}-${webSitesSourceControlsResourceName}-${webSitesSourceControlsResourceLocationId}', '.')
