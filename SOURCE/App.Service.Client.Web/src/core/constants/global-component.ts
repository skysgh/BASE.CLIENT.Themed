// Constants:
import { system /*as importedSystemConst*/ } from './system';

export const GlobalComponent = {

  headerToken: { 'Authorization': `Bearer ${sessionStorage.getItem(system.storage.system.token)}` },



}
