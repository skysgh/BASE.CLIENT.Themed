import { MenuItem } from '../../../app/layouts/sidebar/menu.model';


export const MENU: MenuItem[] = [
  {
    id: 10,
    label: 'BASE.DASHBOARDS.TITLE',
    icon: 'home',
    link: 'dashboard',
  },
  {
    id: 20,
    label: 'APPS.TITLE',
    subItems: [
      {
        id: 201,
        label: 'APPS.SPIKE.TITLE',
        link: 'spike/spike',
        parentId: 20
      },
      {
        id: 202,
        label: 'APPS.ARCHITECTURE.TITLE',
        parentId: 20,
        subItems: [
          {
            id: 2021,
            parentId: 202,
            label: 'BASE.VALUES.TITLES',
            link: 'architecture/values',
          },
          {
            id: 2022,
            parentId: 202,
            label: 'BASE.PRINCIPLES.TITLES',
            link: 'architecture/principles',
          },
          {
            id: 2023,
            parentId: 202,
            label: 'BASE.QUALITIES.TITLES',
            link: 'architecture/qualities',
          },

          {
            id: 2024,
            parentId: 202,
            label: 'BASE.PATTERNS.TITLES',
            link: 'architecture/patterns',
          },
        ]
      },
      {
        id: 203,
        label: 'BASE.PRODUCTS.TITLES',
        link: 'products',
        icon: 'package',
        parentId: 20
      },
      {
        id: 204,
        label: 'BASE.PEOPLE.TITLES',
        icon:'users',
        link: 'people',
        parentId: 20
      },
      {
        id: 204,
        label: 'BASE.PLACES.TITLES',
        link: 'places',
        icon: 'map-pin',
        parentId: 20
      },
      {
        id: 205,
        label: 'BASE.PARTICIPATION.TITLE',
        link: 'participation',
        icon: 'airplay',
        parentId: 20
      },
      {
        id: 206,
        label: 'BASE.PROGRESS.TITLE',
        link: 'progress',
        icon: 'chart',
        parentId: 20
      },
      {
        id: 207,
        label: 'BASE.ACCOMPLISHMENTS.TITLES',
        link: 'accomplishments',
        icon: 'airplay',
        parentId: 20
      }
    ]
  },
  {
    id: 30,
    label: 'BASE.INFORMATION.TITLE',
    icon: 'grid',
    subItems: [
      {
        id: 301,
        parentId: 30,
        label: 'BASE.PRIVACY_POLICIES.TITLE',
        link: '/information/privacy',
      },
      {
        id: 302,
        parentId: 30,
        label: 'BASE.TERMS_AND_CONDITIONS.TITLE',
        link: '/information/terms',
      },
      {
        id: 303,
        parentId: 30,
        label: 'BASE.CORRECTIONS.TITLE',
        link: '/information/corrections',
      },
      {
        id: 304,
        parentId: 30,
        label: 'BASE.SUPPORT.TITLE',
        link: '/information/support'
      }
    ]
  },

  {
    id: 40,
    label: 'BASE.SETTINGS.TITLES',
    icon: 'command',
    subItems: [
      {
        id: 401,
        parentId: 40,
        label: 'BASE.SYSTEMS.TITLE',
        link: '/settings/system'
      },
      {
        id: 402,
        parentId: 40,
        label: 'BASE.TENANCIES.TITLES',
        link: '/settings/tenancy'
      },
      {
        id: 403,
        parentId: 40,
        label: 'BASE.GROUPS.TITLES',
        link: '/settings/group'
      },
      {
        id: 404,
        parentId: 40,
        label: 'BASE.USERS.TITLES',
        link: '/settings/user'
      }
    ]
  }
]
