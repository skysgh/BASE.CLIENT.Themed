import { MenuItem } from '../../../app/layouts/sidebar/menu.model';


export const MENU: MenuItem[] = [
  {
    id: 10,
    label: 'BASE.CORE.AREAS.DASHBOARD.MENU.TITLE',
    icon: 'home',
    link: 'dashboard',
  },
  {
    id: 20,
    label: 'BASE.APPLETS.MENU.TITLE',
    subItems: [
      {
        id: 201,
        label: 'BASE.APPLETS.SPIKE.MENU.TITLE',
        link: 'spike/spike',
        parentId: 20
      },
      {
        id: 202,
        label: 'BASE.APPLETS.ARCHITECTURE.MENU.TITLE',
        parentId: 20,
        subItems: [
          {
            id: 2021,
            parentId: 202,
            label: 'BASE.APPLETS.ARCHITECTURE.MODULES.VALUES.MENU.TITLE',
            link: 'architecture/values',
          },
          {
            id: 2022,
            parentId: 202,
            label: 'BASE.APPLETS.ARCHITECTURE.MODULES.PRINCIPLES.MENU.TITLE',
            link: 'architecture/principles',
          },
          {
            id: 2023,
            parentId: 202,
            label: 'BASE.APPLETS.ARCHITECTURE.MODULES.QUALITIES.MENU.TITLE',
            link: 'architecture/qualities',
          },

          {
            id: 2024,
            parentId: 202,
            label: 'BASE.APPLETS.ARCHITECTURE.MODULES.PATTERNS.MENU.TITLE',
            link: 'architecture/patterns',
          },
        ]
      },
      {
        id: 203,
        label: 'BASE.APPLETS.PRODUCTS.MENU.TITLE',
        link: 'products',
        icon: 'package',
        parentId: 20
      },
      {
        id: 204,
        label: 'BASE.APPLETS.PEOPLE.MENU.TITLE',
        icon:'users',
        link: 'people',
        parentId: 20
      },
      {
        id: 204,
        label: 'BASE.APPLETS.PLACES.MENU.TITLE',
        link: 'places',
        icon: 'map-pin',
        parentId: 20
      },
      {
        id: 205,
        label: 'BASE.APPLETS.PARTICIPATION.MENU.TITLE',
        link: 'participation',
        icon: 'airplay',
        parentId: 20
      },
      {
        id: 206,
        label: 'BASE.APPLETS.PROGRESS.MENU.TITLE',
        link: 'progress',
        icon: 'chart',
        parentId: 20
      },
      {
        id: 207,
        label: 'BASE.APPLETS.ACCOMPLISHMENTS.MENU.TITLE',
        link: 'accomplishments',
        icon: 'airplay',
        parentId: 20
      }
    ]
  },
  {
    id: 30,
    label: 'BASE.CORE.AREAS.INFORMATION.MENU.TITLE',
    icon: 'grid',
    subItems: [
      {
        id: 301,
        parentId: 30,
        label: 'BASE.CORE.AREAS.INFORMATION.PRIVACY_POLICY.MENU.TITLE',
        link: '/information/privacy',
      },
      {
        id: 302,
        parentId: 30,
        label: 'BASE.CORE.AREAS.INFORMATION.TERMS_AND_CONDITIONS.MENU.TITLE',
        link: '/information/terms',
      },
      {
        id: 303,
        parentId: 30,
        label: 'BASE.CORE.AREAS.INFORMATION.CORRECTIONS.MENU.TITLE',
        link: '/information/corrections',
      },
      {
        id: 304,
        parentId: 30,
        label: 'BASE.CORE.AREAS.INFORMATION.SUPPORT.MENU.TITLE',
        link: '/information/support'
      }
    ]
  },

  {
    id: 40,
    label: 'BASE.CORE.AREAS.SETTINGS.MENU.TITLE',
    icon: 'command',
    subItems: [
      {
        id: 401,
        parentId: 40,
        label: 'BASE.CORE.AREAS.SETTINGS.SYSTEM.MENU.TITLE',
        link: '/settings/system'
      },
      {
        id: 402,
        parentId: 40,
        label: 'BASE.CORE.AREAS.SETTINGS.TENANCY.MENU.TITLE',
        link: '/settings/tenancy'
      },
      {
        id: 403,
        parentId: 40,
        label: 'BASE.CORE.AREAS.SETTINGS.GROUP.MENU.TITLE',
        link: '/settings/group'
      },
      {
        id: 404,
        parentId: 40,
        label: 'BASE.CORE.AREAS.SETTINGS.USER.MENU.TITLE',
        link: '/settings/user'
      }
    ]
  }
]
