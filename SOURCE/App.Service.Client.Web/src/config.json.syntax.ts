interface SystemConfig {
  title: string,
  description: string,

  //environment: any <-- do not override

  /** Context (Distributor, Sponsor, Developer) */
  context: {
    distributor: {
      title: string,
      description: string,
      channels: {
        email: string,
        tel: string,
        postal: {
          street: string,
          street2: '',
          city: string,
          region: string,
          code: string,
          country: string
        }
      }
    }
    sponsor: {
      title: string,
      description: string,
      channels: {
        email: string,
        tel: string,
        postal: {
          street: string,
          street2: '',
          city: string,
          region: string,
          code: string,
          country: string
        }
      }
    }
    developer: {
      title: string,
      description: string,
      channels: {
        email: string,
        tel: string,
        postal: {
          street: string,
          street2: '',
          city: string,
          region: string,
          code: string,
          country: string
        }
      }
    }
    mediaDeveloper: {
      title: string,
      description: string,
      channels: {
        email: string,
        tel: string,
        postal: {
          street: string,
          street2: '',
          city: string,
          region: string,
          code: string,
          country: string
        }
      }
    }
  }
  /** Copyright statements */
  copyrights: {
    code: string,
    resources: string,
    media: string,
    contents: string
  }

  /*** Navigation */
  navigation: any,

  /** API Paths */
  apis: any,

  /** Assets */
  assets: {
    open: {
      images: string,
    },
    sensitive: {
      images: string,
    },
  }

  applets: {
    defaultAppId: string,
    appIds: [
      "Demo",
      "Other",
      "..."
    ]
  }
  sites: {
  }
  themes: {
    //same...
  }
  coreAg: {
    //same as core...
  },
  core: {
    apis: any,
    assets: any,
    constants: any,
    navigation: any
  },
}
