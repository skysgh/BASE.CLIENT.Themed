import { MenuItem } from '../../../../app/layouts/sidebar/menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'MODULES.ID',
    icon: 'home',
    subItems: [
      {
        id: 3,
        label: 'MODULES.SPIKE.ID',
        link: '/',
        parentId: 2
      },
      {
        id: 4,
        label: 'MODULES.ARCHITECTURE.ID',
        link: '/',
        parentId: 2,
        subItems: [
          {
            id: 4,
            label: 'MODULES.ARCHITECTURE.MODULES.VALUES.ID',
            link: '/',
          },
          {
            id: 4,
            label: 'MODULES.ARCHITECTURE.MODULES.PRINCIPLES.ID',
            link: '/',
          },
          {
            id: 4,
            label: 'MODULES.ARCHITECTURE.MODULES.QUALITIES.ID',
            link: '/',
          },

          {
            id: 4,
            label: 'MODULES.ARCHITECTURE.MODULES.PATTERNS.ID',
            link: '/',
          },
        ]
      },
      {
        id: 5,
        label: 'MODULES.PRODUCTS.ID',
        link: '/',
        parentId: 2
      },
      {
        id: 6,
        label: 'MODULES.PEOPLE.ID',
        link: '/',
        parentId: 2
      },
      {
        id: 7,
        label: 'MODULES.PLACES.ID',
        link: '/',
        parentId: 2
      }
    ]
  },
  {
    id: 82,
    label: 'MENUITEMS.PAGES.TEXT',
    icon: 'command',
    subItems: [
      {
        id: 87,
        label: 'MENUITEMS.PAGES.LIST.TEAM',
        link: '/',
        parentId: 82
      },
      {
        id: 88,
        label: 'MENUITEMS.PAGES.LIST.TIMELINE',
        link: '/',
        parentId: 82
      },
      {
        id: 89,
        label: 'MENUITEMS.PAGES.LIST.FAQS',
        link: '/',
        parentId: 82
      },
      {
        id: 90,
        label: 'MENUITEMS.PAGES.LIST.PRICING',
        link: '/',
        parentId: 82
      },
      {
        id: 91,
        label: 'MENUITEMS.PAGES.LIST.GALLERY',
        link: '/',
        parentId: 82
      },
      {
        id: 92,
        label: 'MENUITEMS.PAGES.LIST.MAINTENANCE',
        link: '/',
        parentId: 82
      },
      {
        id: 93,
        label: 'MENUITEMS.PAGES.LIST.COMINGSOON',
        link: '/',
        parentId: 82
      },
      {
        id: 94,
        label: 'MENUITEMS.PAGES.LIST.SITEMAP',
        link: '/',
        parentId: 82
      },
      {
        id: 95,
        label: 'MENUITEMS.PAGES.LIST.SEARCHRESULTS',
        link: '/',
        parentId: 82
      },
      {
        id: 96,
        label: 'MENUITEMS.PAGES.LIST.PRIVACYPOLICY',
        link: '/',
        parentId: 82
      },
      {
        id: 97,
        label: 'MENUITEMS.PAGES.LIST.TERMS&CONDITIONS',
        link: '/',
        parentId: 82
      }
    ]
  },

];
