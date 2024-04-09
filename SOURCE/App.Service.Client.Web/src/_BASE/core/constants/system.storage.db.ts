import { environment } from "../../../environments/environment";
import { SystemDbStorage } from "./contracts/system.storage.db";

/** only need this temporarily*/
let C_DEFAULT_FK_FIELDNAME_SUFFIX: string | undefined;

// what it is, depends on the limits of the api server used.
if (environment.custom.service.type == 'json-server') {
  C_DEFAULT_FK_FIELDNAME_SUFFIX = 'id';
}
else if (environment.custom.service.type == 'soul') {
  C_DEFAULT_FK_FIELDNAME_SUFFIX = 'id';
} else {
  C_DEFAULT_FK_FIELDNAME_SUFFIX = 'FK';
}

/** Constants of the column names used in database tables */
export const systemDbStorage: SystemDbStorage = {
  defaultFieldNames: {
    id: "id",
    /** depending on api server, can be 'id', 'Id', 'fk', 'Fk' or ''FK'
     * I much prefer 'FK' but json-server and soul do stuff automatically
     * based on the suffix being 'id'.
     * TODO: improve to handle different cases.
     */
    fKSuffix: C_DEFAULT_FK_FIELDNAME_SUFFIX,
    timestamp: "timestampUtc",
    enabled: "enabled",
    fromUtc: "fromUtc",
    toUtc: "toUtc",
    serviceFK: "service" + C_DEFAULT_FK_FIELDNAME_SUFFIX,
    stateFK: 'state' + C_DEFAULT_FK_FIELDNAME_SUFFIX,
    tenancyFK: "tenant" + C_DEFAULT_FK_FIELDNAME_SUFFIX,
    parentFK: "parent" + C_DEFAULT_FK_FIELDNAME_SUFFIX,
    // less essential but some other repetitive ones:
    title: 'title',
    description:'description',
    languageCode: 'languageCode',
    preferred:'preferred',
    defaultDisplayOrder:'defaultDisplayOrder'
  }
};
/** try to clear. Probably unsuccessfully... */
C_DEFAULT_FK_FIELDNAME_SUFFIX  = undefined ;
