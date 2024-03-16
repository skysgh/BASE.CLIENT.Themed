import { MenuItem } from '../../../app/layouts/sidebar/menu.model';


export const MENU: MenuItem[] =
[
  {
    id: 10,
    label: 'BASE.DASHBOARDS.TITLE',
    icon: 'home',
    link: 'dashboard',
  },
  {
    id: 20,
    label: 'APPS.TITLE',
    icon:'grid-alt',
    subItems: [
      {
        id: 201,
        label: 'APPS.SPIKE.TITLE',
        link: 'spike/spikes',
        parentId: 20
      },
      {
        id: 202,
        label: 'APPS.ARCHITECTURE.TITLE',
        parentId: 20,
        icon:'building-house',
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
      }
    ]
  },

  {
    id: 203,
    label: 'APPS.EDUCATION.TITLE',
    parentId: 20,
    icon: 'navigation',
    subItems: [
      {
        id: 2031,
        label: 'BASE.PRODUCTS.TITLES',
        link: 'products',
        icon: 'package',
        parentId: 203
      },
      {
        id: 2032,
        label: 'BASE.PEOPLE.TITLES',
        icon: 'users',
        link: 'people',
        parentId: 203,
        subItems:[
          {
            id: 20321,
            label: 'BASE.EDUCATION.ROLES.LEARNERS',
            link: 'places',
            icon: 'map-pin',
            parentId: 20321
          },
          {
            id: 20321,
            label: 'BASE.EDUCATION.ROLES.CARETAKERS',
            link: 'places',
            icon: 'map-pin',
            parentId: 20321
          },
          {
            id: 20322,
            label: 'BASE.EDUCATION.ROLES.TEACHERS',
            link: 'places',
            icon: 'map-pin',
            parentId: 20321
          },
          {
            id: 20322,
            label: 'BASE.EDUCATION.ROLES.ADMINSTRATORS',
            link: 'places',
            icon: 'map-pin',
            parentId: 20321
          },
          {
            id: 20322,
            label: 'BASE.EDUCATION.ROLES.PRINCIPLES',
            link: 'places',
            icon: 'map-pin',
            parentId: 20321
          },
          {
            id: 20322,
            label: 'BASE.EDUCATION.ROLES.SPECIALISTS',
            link: 'places',
            icon: 'map-pin',
            parentId: 20321
          },
        ]
      },
      {
        id: 2033,
        label: 'BASE.PLACES.TITLES',
        link: 'places',
        icon: 'map-pin',
        parentId: 203
      },
      {
        id: 2034,
        label: 'BASE.ENROLLMENT.TITLE',
        link: 'financials',
        icon: 'airplay',
        parentId: 203
      },
      {
        id: 2035,
        label: 'BASE.FINANCIALS.TITLE',
        link: 'financials',
        icon: 'airplay',
        parentId: 203
      },
      {
        id: 2036,
        label: 'BASE.PARTICIPATION.TITLE',
        link: 'participation',
        icon: 'airplay',
        parentId: 203
      },
      {
        id: 2037,
        label: 'BASE.ASSESSMENTS.TITLES',
        link: 'accomplishments',
        icon: 'airplay',
        parentId: 203
      },
      {
        id: 2038,
        label: 'BASE.PROGRESS.TITLE',
        link: 'progress',
        icon: 'chart',
        parentId: 203
      },
      {
        id: 2039,
        label: 'BASE.ACCOMPLISHMENTS.TITLES',
        link: 'accomplishments',
        icon: 'airplay',
        parentId: 203
      }
    ]
  },

    {
      id: 203,
      label: 'APPS.HEALTH.TITLE',
      parentId: 20,
      icon: 'heart'
    },

    {
    id: 30,
    label: 'BASE.INFORMATION.TITLE',
    icon: 'info',
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
    icon: 'settings',
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
