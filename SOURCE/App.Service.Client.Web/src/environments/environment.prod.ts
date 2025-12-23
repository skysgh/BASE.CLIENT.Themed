import { Environment } from "./environment.types";
import { environmentSharedCustomProd } from "./environment.custom";

export const environment: Environment = {
  // Specific to this app.
  custom: environmentSharedCustomProd,

  production: true,
  defaultauth: 'fackbackend',
  
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};
