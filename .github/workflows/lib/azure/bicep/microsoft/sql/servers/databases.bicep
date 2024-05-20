// ======================================================================
// References:
// ======================================================================
// https://learn.microsoft.com/en-us/azure/azure-sql/database/single-database-create-bicep-quickstart?view=azuresql&tabs=CLI

// ======================================================================
// Scope
// ======================================================================
// Scope is parent resourceGroup:
targetScope='resourceGroup'

// ======================================================================
// Import Shared Settings
// ======================================================================
var sharedSettings = loadJsonContent('../../../settings/shared.json')

// ======================================================================
// Dependencies
// ======================================================================
 @description('the parent SqlServer *module*\'s symbolic name.')
param parentResourceName string


// ======================================================================
// Default Name, Location, Tags,
// ======================================================================
@description('the name of this database resource.')
param resourceName string

@description('The id of the location for this resource.')
// @allowed([])
param resourceLocationId string

@description('The tags to merge for this resource.')
param resourceTags object = {}

// ======================================================================
// Default SKU, Tier, ...etc.
// ======================================================================
@description('The SKU of this resource.The default is \'Basic\' to save costs.')
@allowed(['Basic','Standard'])
param resourceSKU string = 'Basic'

@description('The Tier of this resource. The default is \'Basic\' to save costs.')
@allowed(['Standard', 'Premium'])
param resourceTier string = 'Standard'
// ======================================================================
// Other resource specific vars
// ======================================================================
@description('Time in minutes after which database is automatically paused. A value of -1 means that automatic pause is disabled. Default:2')
param autoPauseDelay int = 60

//@allowed([None', 'UserAssigned'])
//param userType string = 'UserAssigned'

@description('If the DB is free (one per subscription, then what do to when passing free offer. Default: \'BillOverUsage\'. ')
@allowed(['AutoPause', 'BillOverUsage'])
param freeLimitExhaustionBehavior string = 'BillOverUsage'

@description('Specifies the availability zone the database is pinned to.	Default is\'NoPreference\'')
@allowed(['1', '2', '3', 'NoPreference'])
param availabilityZone string = 'NoPreference'

@description('	Collation of the metadata catalog.. Default is \'DATABASE_DEFAULT\' (which is by default \'SQL_Latin1_General_CP1_CI_AS\').')
@allowed(['DATABASE_DEFAULT', 'SQL_Latin1_General_CP1_CI_AS'])
param catalogCollation string = 'DATABASE_DEFAULT'

@description('	Collation of the metadata catalog.. Default is \'SQL_Latin1_General_CP1_CI_AS\'.')
@allowed(['SQL_Latin1_General_CP1_CI_AS'])
param collation string = 'SQL_Latin1_General_CP1_CI_AS'

@description('Creation Mode.. Default is \'Default\'.')
@allowed(['Copy', 'Default', 'OnlineSecondary', 'PointInTimeRestore', 'Recovery', 'Restore', 'RestoreExternalBackup', 'RestoreExternalBackupSecondary', 'RestoreLongTermRetentionBackup', 'Secondary'])
param createMode string = 'Default'

@description('Whether the database is a Ledger one, permitting to review historical values. Default is \'true\'.')
param isLedgerOn bool = true

@description('Name of Sample database schema to develop . Default is \'\'.')
@allowed(['', 'AdventureWorksLT', 'WideWorldImportersFull', 'WideWorldImportersStd'])
param sampleName string = ''

@description('Whether or not the database uses free monthly limits. Allowed on one database in a subscription.')
param useFreeLimit bool = false


@description('Whether or not this database is zone redundant, which means the replicas of this database will be spread across multiple availability zones. Default: false')
param zoneRedundant bool = false

// ======================================================================
// Default Variables: useResourceName, useTags
// ======================================================================
var useName = '${parentResourceName}/${resourceName}'
var useLocation = resourceLocationId
var useTags = union(resourceTags,sharedSettings.defaultTags)

// ======================================================================
// Resource bicep
// ======================================================================

resource resultResource 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {


  name: useName
  location: useLocation
  tags: useTags

  sku: {
    //capacity: int
    name: resourceSKU
    tier: resourceTier
    //family: 'string'
    //size: 'string'
}
//  identity: {
//    type: userType
//    userAssignedIdentities: {
//      The resource ids of the user assigned identities to use
//      {customized property}: {}
//    }
//  }

  properties: {
    useFreeLimit: useFreeLimit 
    freeLimitExhaustionBehavior: freeLimitExhaustionBehavior 

    autoPauseDelay: autoPauseDelay

    zoneRedundant: zoneRedundant  

    availabilityZone: availabilityZone

    createMode: createMode
 
    collation: collation
    catalogCollation: catalogCollation

    isLedgerOn: isLedgerOn     // Develop History tables permitting rollback
    sampleName: sampleName     // If we are building a sample DB


    // elasticPoolId: 'string'
    // encryptionProtector: 'string'
    // encryptionProtectorAutoRotation: bool
    // federatedClientId: 'string'
    // highAvailabilityReplicaCount: int
    // keys: {
    //   {customized property}: {}
    // }
    // licenseType: 'string'
    // longTermRetentionBackupResourceId: 'string'
    // maintenanceConfigurationId: 'string'
    // manualCutover: bool
    // maxSizeBytes: int
    // minCapacity: json('decimal-as-string')
    // performCutover: bool
    // preferredEnclaveType: 'string'
    // readScale: 'string'
    // recoverableDatabaseId: 'string'
    // recoveryServicesRecoveryPointId: 'string'
    // requestedBackupStorageRedundancy: 'string'
    // restorableDroppedDatabaseId: 'string'
    // restorePointInTime: 'string'
    // secondaryType: 'string'
    // sourceDatabaseDeletionDate: 'string'
    // sourceDatabaseId: 'string'
    // sourceResourceId: 'string'

  } 
}

// ======================================================================
// Default Outputs: resource, resourceId, resourceName & variable sink
// ======================================================================
// Provide ref to developed resource:
output resource object = resultResource
// return the id (the fully qualitified name) of the newly created resource:
output resourceId string = resultResource.id
// return the (short) name of the newly created resource:
output resourceName string = resultResource.name
// param sink (to not cause error if param is not used):
output _ bool = startsWith(concat('${sharedSettings.version}'), '.')
