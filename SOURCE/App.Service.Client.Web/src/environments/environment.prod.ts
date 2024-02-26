export const environment = {
  custom: {
    diagnostics: {
      // 0=Verbose, 1=Info, 2=Warn, 3=Error, 4=No logging 
      level: 0
    },
    service: {
      baseUrl: 'http://localhost:8021/'
    },
  },  production: true,
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
