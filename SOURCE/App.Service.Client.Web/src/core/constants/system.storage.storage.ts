import { SystemSystemStorage } from "./contracts/system.storage.system";



export const systemSystemStorage: SystemSystemStorage = {
    /** TODO: There's duplication that needs rationalisation and consolidation! */
    /** used for bearer token */
    token: 'token',
    currentUser: 'currentUser',
    toast: 'toast',
    users: 'users',
    authUser: 'authUser',
    authToken: 'auth-token'
};
