import { IHasMenuItem } from '../models/contracts/IHasMenuItem';
// Constants:
import { system } from '../constants/system';


export const MENU: IHasMenuItem[] =
  [
    {
      id: 10,
      title: 'BASE.DASHBOARDS.PLURAL',
      description: 'BASE.DASHBOARD.DESCRIPTION',
      icon: 'home',
      link: system.navigation.dashboard.root,
    },
    {
      id: 20,
      title: 'BASE.APPS.PLURAL',
      description: 'APPS.DESCRIPTION',
      icon: 'grid-alt',
      subItems: [
        {
          id: 201,
          title: 'APPS.SPIKE.SINGULAR',
          description: 'APPS.SPIKES.DESCRIPTION',
          link: system.navigation.apps.spikes.root,
          parentId: 20
        },
        {
          id: 202,
          title: 'APPS.ARCHITECTURE.SINGULAR',
          description: 'APPS.ARCHITECTURE.DESCRIPTION',
          parentId: 20,
          icon: 'building-house',
          subItems: [
            {
              id: 2021,
              parentId: 202,
              title: 'BASE.VALUES.PLURAL',
              description: 'BASE.VALUES.DESCRIPTION',
              link: system.navigation.apps.architecture.values,
            },
            {
              id: 2022,
              parentId: 202,
              title: 'BASE.PRINCIPLES.PLURAL',
              description: 'BASE.PRINCIPLES.DESCRIPTION',
              link: system.navigation.apps.architecture.principles,
            },
            {
              id: 2023,
              parentId: 202,
              title: 'BASE.QUALITIES.PLURAL',
              description: 'BASE.QUALITIES.DESCRIPTION',
              link: system.navigation.apps.architecture.qualities,
            },
            {
              id: 2024,
              parentId: 202,
              title: 'BASE.PATTERNS.PLURAL',
              description: 'BASE.PATTERNS.DESCRIPTION',
              link: system.navigation.apps.architecture.patterns,
            },
          ]
        }
      ]
    },

    {
      id: 203,
      title: 'APPS.EDUCATION.SINGULAR',
      description: 'APPS.EDUCATION.DESCRIPTION',
      parentId: 20,
      icon: 'navigation',
      subItems: [
        {
          id: 2031,
          title: 'BASE.PRODUCTS.PLURAL',
          description: 'APPS.PRODUCTS.DESCRIPTION',
          link: system.navigation.apps.education.products.root,
          icon: 'package',
          parentId: 203
        },
        {
          id: 2032,
          title: 'BASE.PEOPLE.SINGULAR',
          description: 'APPS.PEOPLE.DESCRIPTION',
          icon: 'users',
          link: system.navigation.apps.education.people.root,
          parentId: 203, 
          subItems: [
            {
              id: 20321,
              title: 'BASE.EDUCATION.ROLES.ALL',
              description: 'BASE.EDUCATION.DESCRIPTION',
              link: system.navigation.apps.education.people.root,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20321,
              title: 'BASE.EDUCATION.ROLES.LEARNERS',
              description: 'BASE.EDUCATION.DESCRIPTION',
              link: system.navigation.apps.education.people.learners,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20321,
              title: 'BASE.EDUCATION.ROLES.CARETAKERS',
              description: '...',
              link: system.navigation.apps.education.people.caretakers,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.EDUCATION.ROLES.TEACHERS',
              description: '...',
              link: system.navigation.apps.education.people.teachers,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.EDUCATION.ROLES.ADMINISTRATORS',
              description: '...',
              link: system.navigation.apps.education.people.administrators,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.EDUCATION.ROLES.PRINCIPALS',
              description: '...',
              link: system.navigation.apps.education.people.principals,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.EDUCATION.ROLES.SPECIALISTS',
              description: '...',
              link: system.navigation.apps.education.people.specialists,
              icon: 'map-pin',
              parentId: 20321
            },

            {
              id: 20323,
              title: 'BASE.EDUCATION.TERMS.ALUMNI',
              description: '...',
              link: system.navigation.apps.education.people.alumni,
              icon: 'map-pin',
              parentId: 20321
            },
          ]
        },

        {
          id: 2033,
          title: 'BASE.PLACES.PLURAL',
          description: '...',
          link: system.navigation.apps.education.places.root,
          icon: 'map-pin',
          parentId: 203
        },
        {
          id: 2034,
          title: 'BASE.ENROLLMENTS.PLURAL',
          description: '...',
          link: system.navigation.apps.education.enrollments.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2035,
          title: 'BASE.FINANCES.PLURAL',
          description: '...',
          link: system.navigation.apps.education.finances.root,
          icon: 'airplay',
          parentId: 203
        },

        {
          id: 2036,
          title: 'BASE.PRESENCE.SINGULAR',
          description: '...',
          link: system.navigation.apps.education.presence.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2037,
          title: 'BASE.PARTICIPATIONS.SINGULAR',
          description: '...',
          link: system.navigation.apps.education.participation.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2038,
          title: 'BASE.ASSESSMENTS.PLURAL',
          description: '...',
          link: system.navigation.apps.education.assessments.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2039,
          title: 'BASE.PROGRESS.SINGULAR',
          description: '...',
          link: system.navigation.apps.education.progress.root,
          icon: 'chart',
          parentId: 203
        },
        {
          id: 2030,
          title: 'BASE.ACCOMPLISHMENTS.PLURAL',
          description: '...',
          link: system.navigation.apps.education.accomplishments.root,
          icon: 'airplay',
          parentId: 203
        },
      ]
    },

    {
      id: 203,
      title: 'APPS.HEALTH.SINGULAR',
      description: '...',
      parentId: 20,
      icon: 'heart'
    },

    {
      id: 30,
      title: 'BASE.INFORMATION.SINGULAR',
      description: '...',
      icon: 'info',
      subItems: [
        {
          id: 301,
          parentId: 30,
          title: 'BASE.POLICIES.PRIVACY',
          description: '...',
          link: system.navigation.pages.public.information.privacy,
        },
        {
          id: 302,
          parentId: 30,
          title: 'BASE.TERMS.TERMS_AND_CONDITIONS',
          description: '...',
          link: system.navigation.pages.public.information.terms,
        },
        {
          id: 303,
          parentId: 30,
          title: 'BASE.CORRECTIONS.PLURAL',
          description: '...',
          link: system.navigation.pages.public.information.corrections,
        },
        {
          id: 304,
          parentId: 30,
          title: 'BASE.SUPPORT.SINGULAR',
          description: '...',
          link: system.navigation.pages.public.information.support,
        }
      ]
    },

    {
      id: 40,
      title: 'BASE.SETTINGS.PLURAL',
      description: '...',
      icon: 'settings',
      subItems: [
        {
          id: 401,
          parentId: 40,
          title: 'BASE.SYSTEMS.SINGULAR',
          description: '...',
          link: system.navigation.settings.system,
        },
        {
          id: 402,
          parentId: 40,
          title: 'BASE.TENANCIES.PLURAL',
          description: '...',
          link: system.navigation.settings.tenancy,
        },
        {
          id: 403,
          parentId: 40,
          title: 'BASE.GROUPS.PLURAL',
          description: '...',
          link: system.navigation.settings.group,
        },
        {
          id: 404,
          parentId: 40,
          title: 'BASE.USERS.PLURAL',
          description: '...',
          link: system.navigation.settings.user,
        }
      ]
    }

  ];
