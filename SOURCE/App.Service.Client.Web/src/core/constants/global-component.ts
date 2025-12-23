// Constants:
import { coreConfiguration } from '../configuration/implementations/core.configuration';

export const GlobalComponent = {

  headerToken: { 'Authorization': `Bearer ${sessionStorage.getItem(coreConfiguration.constants.storage.session.token)}` },

}
