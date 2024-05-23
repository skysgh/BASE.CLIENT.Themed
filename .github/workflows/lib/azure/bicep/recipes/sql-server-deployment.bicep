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
// Parent Resource Group  
// ======================================================================
@description('The name of the resource group in which to create these resources. ')
@minLength(3)
param resourceGroupName string

// ======================================================================
// Params: Resource Defaults 
// ======================================================================
@description('The default name of resources.')
@minLength(3)
param defaultResourceName string 

@description('The default suffix of resouces, appended to defaultResourceName.')
param defaultResourceNameSuffix string = uniqueString(toUpper(resourceGroupName)) 

@description('The default location of resources. ')
// @allowed(...too long...)
param defaultResourceLocationId string 

@description('The tags for this resource. ')
param defaultResourceTags object = {}

// ======================================================================
// Params: Sql Server 
// ======================================================================
@description('The name of the sql server. Required to be universally unique (\'defaultResourceNameSuffix\' will be appended later).')
param sqlServerResourceName string = toLower(defaultResourceName) 

@description('Location of Resource. Default is \'defaultResourceLocationId\'.')
//TOO Big: @allowed([ 'australiacentral'])
param sqlServerResourceLocationId string  = defaultResourceLocationId

@description('The tags for this resource.')
param sqlServerResourceTags object = {}

@description('TODO:...: Default is: \'SystemAssigned,UserAssigned\' permitting creation using dbms admin user name & pwd, and later AAD sourced service account. ')
@allowed(['None', 'SystemAssigned', 'SystemAssigned,UserAssigned', 'UserAssigned' ])
param sqlServerIdentityType string = 'SystemAssigned,UserAssigned'

@description('The minimal Tls Version to use. Default is \'1.3\'.')
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

@description('Name of database. Default is set to lowercase of \'sqlServerResourceName\'.')
param sqlServerDbResourceName string = toLower(sqlServerResourceName)

@description('Location of Database. Default is set to \'sqlServerResouceLocationId\'.')
//TOO Big: @allowed([ 'australiacentral'])
param sqlServerDbResourceLocationId string = sqlServerResouceLocationId

@description('The tags for this resource. ')
param sqlServerDbResourceTags object = {}

@description('The SKU of this resource.The default is \'Basic\' to save costs.')
// @allowed(['Basic', 'StandardS0', 'StandardS1', 'StandardS2', 'StandardS3', 'StandardS4', 'StandardS6', 'StandardS7', 'StandardS9', 'StandardS12', 'PremiumP1', 'PremiumP2', 'PremiumP4', 'PremiumP6', 'PremiumP11', 'PremiumP15', 'GP_Gen5_2', 'GP_Gen5_4', 'GP_Gen5_8', 'GP_Gen5_16', 'GP_Gen5_24', 'GP_Gen5_32', 'GP_Gen5_40', 'GP_Gen5_80', 'GP_Gen4_2', 'GP_Gen4_4', 'GP_Gen4_8', 'GP_Gen4_16', 'BC_Gen5_2', 'BC_Gen5_4', 'BC_Gen5_8', 'BC_Gen5_16', 'BC_Gen5_24', 'BC_Gen5_32', 'BC_Gen5_40', 'BC_Gen5_80', 'BC_Gen4_2', 'BC_Gen4_4', 'BC_Gen4_8', 'BC_Gen4_16'])
@allowed(['Basic', 'S0', 'S1', 'S2', 'S3', 'S4', 'PremiumP1', 'PremiumP2', 'PremiumP4', 'GP_Gen5_2', 'GP_Gen5_4', 'GP_Gen4_2', 'GP_Gen4_4', 'BC_Gen5_2', 'BC_Gen5_4', 'BC_Gen4_2', 'BC_Gen4_4'])
param sqlServerDbResourceSKU string = 'Basic'

@description('The Tier of this resource. The default is \'Basic\' to save costs.')
@allowed(['Basic', 'Standard', 'Premium', 'GeneralPurpose', 'BusinessCritical'])
//param sqlServerDbResourceTier string = (contains(['Basic', 'StandardS0', 'StandardS1', 'StandardS2', 'StandardS3', 'StandardS4', 'StandardS6', 'StandardS7', 'StandardS9', 'StandardS12'], sqlServerDbResourceSKU) ? 'Standard': (contains(['PremiumP1', 'PremiumP2', 'PremiumP4', 'PremiumP6', 'PremiumP11', 'PremiumP15'], sqlServerDbResourceSKU) ? 'Premium': (contains(['GP_Gen5_2', 'GP_Gen5_4', 'GP_Gen5_8', 'GP_Gen5_16', 'GP_Gen5_24', 'GP_Gen5_32', 'GP_Gen5_40', 'GP_Gen5_80', 'GP_Gen4_2', 'GP_Gen4_4', 'GP_Gen4_8', 'GP_Gen4_16'], sqlServerDbResourceSKU) ? 'GeneralPurpose': (contains(['BC_Gen5_2', 'BC_Gen5_4', 'BC_Gen5_8', 'BC_Gen5_16', 'BC_Gen5_24', 'BC_Gen5_32', 'BC_Gen5_40', 'BC_Gen5_80', 'BC_Gen4_2', 'BC_Gen4_4', 'BC_Gen4_8', 'BC_Gen4_16'], sqlServerDbResourceSKU) ? 'BusinessCritical' : 'Basic'))))
param sqlServerDbResourceTier string = (contains(['Basic', 'S0', 'S1', 'S2', 'S3', 'S4'], sqlServerDbResourceSKU) ? 'Standard': (contains(['PremiumP1', 'PremiumP2', 'PremiumP4'], sqlServerDbResourceSKU) ? 'Premium': (contains(['GP_Gen5_2', 'GP_Gen5_4', 'GP_Gen4_2', 'GP_Gen4_4'], sqlServerDbResourceSKU) ? 'GeneralPurpose': (contains(['BC_Gen5_2', 'BC_Gen5_4', 'BC_Gen4_2', 'BC_Gen4_4'], sqlServerDbResourceSKU) ? 'BusinessCritical' : 'Basic'))))

@description('Time *in minutes* after which database is automatically paused. A value of -1 means that automatic pause is disabled. Default: 120 (2 hours).')
param sqlServerDbAutoPauseDelay int = 120

@description('Specifies the availability zone the database is pinned to.	Default is\'NoPreference\'')
@allowed(['1', '2', '3', 'NoPreference'])
param sqlServerDbAvailabilityZone string = 'NoPreference'

@description('If the DB is free (one per subscription, then what do to when passing free offer. Default: \'BillOverUsage\'. See: \'sqlServerDbUseFreeLimit\'.')
@allowed(['AutoPause', 'BillOverUsage'])
param sqlServerDbFreeLimitExhaustionBehavior string = 'BillOverUsage'

@description('	Collation of the metadata catalog.. Default is \'DATABASE_DEFAULT\' (which is by default \'SQL_Latin1_General_CP1_CI_AS\').')
@allowed(['DATABASE_DEFAULT', 'SQL_Latin1_General_CP1_CI_AS'])
param sqlServerDbCatalogCollation string = 'DATABASE_DEFAULT'

@description('	Collation of the metadata catalog.. Default is \'SQL_Latin1_General_CP1_CI_AS\'.')
@allowed(['SQL_Latin1_General_CP1_CI_AS'])
param sqlServerDbCollation string = 'SQL_Latin1_General_CP1_CI_AS'

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
// CLEANUP
// ======================================================================

// Sql Server Names can only be lowercase alphanumeric or hyphen (not underscore)
sqlServerResourceName = toLower( replace('${sqlServerResourceName}-${defaultResourceNameSuffix}', '_', '-') )
sqlServerDbResourceName = toLower( replace(sqlServerDbResourceName ,'_','-') )

// ======================================================================
// Resource bicep: Sql Server
// ======================================================================
module serversModule '../microsoft/sql/servers.bicep' = {
  scope: resourceGroup(resourceGroupName)
  name:  '${deployment().name}_servers_module'

  params: {
    resourceName: sqlServerResourceName
    resourceLocationId: sqlServerResourceLocationId
    resourceTags: union(sqlServerResourceTags, defaultResourceTags)

    // resourceSKU:....
    // resourceTier:....

    minimalTlsVersion: sqlServerMinimalTlsVersion

    identityType: sqlServerIdentityType
    adminUserName: sqlServerAdminUserName
    adminPassword: sqlServerAdminPassword
  }
}



// ======================================================================
// Resource bicep: Sql Server DB
// ======================================================================
module serversDatabasesModule '../microsoft/sql/servers/databases.bicep' = {
  // should be implied: 
  dependsOn: [serversModule]
  scope: resourceGroup(resourceGroupName)
  name:  '${deployment().name}_servers_databases_module'

  params: {
    // Refer to parent website so it can build resource name without use of parent property.
    parentResourceName: sqlServerResourceName

    resourceName: sqlServerDbResourceName
    resourceLocationId: sqlServerDbResourceLocationId
    resourceTags: union(sqlServerDbResourceTags, defaultResourceTags)
    
    resourceSKU: sqlServerDbResourceSKU
    resourceTier: sqlServerDbResourceTier

    autoPauseDelay: sqlServerDbAutoPauseDelay

    freeLimitExhaustionBehavior: sqlServerDbFreeLimitExhaustionBehavior
    availabilityZone: sqlServerDbAvailabilityZone
    catalogCollation: sqlServerDbCatalogCollation
    collation: sqlServerDbCollation
    createMode: sqlServerDbCreateMode
    isLedgerOn: sqlServerDbIsLedgerOn
    sampleName: sqlServerDbSampleName
    useFreeLimit: sqlServerDbUseFreeLimit
    zoneRedundant: sqlServerDbZoneRedundant
  }
}


// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
// output resource object = serversDatabasesModule.outputs.resource
// output resourceId string = serversDatabasesModule.outputs.resourceId
// output resourceName string = serversDatabasesModule.outputs.resourceName

// param sink (to not cause error if param is not used):
output _ bool = startsWith('${sharedSettings.version}-${sqlServerDbResourceSKU}-${sqlServerDbResourceTier}', '.')
