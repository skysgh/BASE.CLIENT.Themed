export const environment = {
  custom: {
    diagnostics: {
      // 5=Debug, 4=Verbose, 3=Info, 2=Warn, 1=Error
      level: 5
    },
    service: {
      baseUrl: 'http://localhost:8021/',

      // type is 'soul','json-server' or '.net.core'
      // and have to run 'npm run soul', 'npm run json-server' or start the .net.core service.
      // it changes the way query endpoints are built in systemQueryEndpoints.cs
      type: 'json-server',
    }
  },
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
