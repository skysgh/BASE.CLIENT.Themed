import { MenuItem } from '../../../app/layouts/sidebar/menu.model';


export const MENU: MenuItem[] = [
  {
    id: 2,
    label: 'BASE.APPLETS.MENU.TITLE',
    subItems: [
      {
        id: 3,
        label: 'BASE.APPLETS.SPIKE.MENU.TITLE',
        link: 'spike/spike',
        parentId: 2
      },
      {
        id: 4,
        label: 'BASE.APPLETS.ARCHITECTURE.MENU.TITLE',
        parentId: 2,
        subItems: [
          {
            id: 5,
            parentId: 4,
            label: 'BASE.APPLETS.ARCHITECTURE.MODULES.VALUES.MENU.TITLE',
            link: 'architecture/values',
          },
          {
            id: 6,
            parentId: 4,
            label: 'BASE.APPLETS.ARCHITECTURE.MODULES.PRINCIPLES.MENU.TITLE',
            link: 'architecture/principles',
          },
          {
            id: 7,
            parentId: 4,
            label: 'BASE.APPLETS.ARCHITECTURE.MODULES.QUALITIES.MENU.TITLE',
            link: 'architecture/qualities',
          },

          {
            id: 8,
            parentId: 4,
            label: 'BASE.APPLETS.ARCHITECTURE.MODULES.PATTERNS.MENU.TITLE',
            link: 'architecture/patterns',
          },
        ]
      },
      {
        id: 9,
        label: 'BASE.APPLETS.PRODUCTS.MENU.TITLE',
        link: 'products',
        parentId: 2
      },
      {
        id: 10,
        label: 'BASE.APPLETS.PEOPLE.MENU.TITLE',
        link: 'people',
        parentId: 2
      },
      {
        id: 11,
        label: 'BASE.APPLETS.PLACES.MENU.TITLE',
        link: 'places',
        parentId: 2
      },
      {
        id: 12,
        label: 'BASE.APPLETS.PARTICIPATION.MENU.TITLE',
        link: 'participation',
        parentId: 2
      },
      {
        id: 13,
        label: 'BASE.APPLETS.PROGRESS.MENU.TITLE',
        link: 'progress',
        parentId: 2
      },
      {
        id: 14,
        label: 'BASE.APPLETS.ACCOMPLISHMENTS.MENU.TITLE',
        link: 'accomplishments',
        parentId: 2
      }
    ]
  },
  {
    id: 15,
    label: 'BASE.CORE.AREAS.INFORMATION.MENU.TITLE',
    icon: 'grid',
    subItems: [
      {
        id: 9,
        parentId: 15,
        label: 'BASE.CORE.AREAS.INFORMATION.PRIVACY_POLICY.MENU.TITLE',
        link: '/information/privacy',
      },
      {
        id: 10,
        parentId: 15,
        label: 'BASE.CORE.AREAS.INFORMATION.TERMS_AND_CONDITIONS.MENU.TITLE',
        link: '/information/terms',
      },
      {
        id: 11,
        parentId: 15,
        label: 'BASE.CORE.AREAS.INFORMATION.CORRECTIONS.MENU.TITLE',
        link: '/information/corrections',
      },
      {
        id: 12,
        parentId: 15,
        label: 'BASE.CORE.AREAS.INFORMATION.SUPPORT.MENU.TITLE',
        link: '/information/support'
      }
    ]
  },

  {
    id: 100,
    label: 'BASE.CORE.AREAS.SETTINGS.MENU.TITLE',
    icon: 'grid',
    subItems: [
      {
        id: 101,
        parentId: 100,
        label: 'BASE.CORE.AREAS.SETTINGS.SYSTEM.MENU.TITLE',
        link: '/settings/system'
      },
      {
        id: 102,
        parentId: 100,
        label: 'BASE.CORE.AREAS.SETTINGS.TENANCY.MENU.TITLE',
        link: '/settings/tenancy'
      },
      {
        id: 103,
        parentId: 100,
        label: 'BASE.CORE.AREAS.SETTINGS.GROUP.MENU.TITLE',
        link: '/settings/group'
      },
      {
        id: 104,
        parentId: 100,
        label: 'BASE.CORE.AREAS.SETTINGS.USER.MENU.TITLE',
        link: '/settings/user'
      }
    ]
  }
]
