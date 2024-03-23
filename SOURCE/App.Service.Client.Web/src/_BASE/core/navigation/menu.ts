import { IHasMenuItem } from '../../shared/models/contracts/IHasMenuItem';
// Constants:
import { system } from '../../shared/constants/system';


export const MENU: IHasMenuItem[] =
  [
    {
      id: 10,
      title: 'BASE.DASHBOARDS.TITLE',
      description: 'BASE.DASHBOARD.DESCRIPTION',
      icon: 'home',
      link: 'dashboard',
    },
    {
      id: 20,
      title: 'APPS.TITLE',
      description: 'APPS.DESCRIPTION',
      icon: 'grid-alt',
      subItems: [
        {
          id: 201,
          title: 'APPS.SPIKE.TITLE',
          description: 'APPS.SPIKES.DESCRIPTION',
          link: system.navigation.apps.spikes.root,
          parentId: 20
        },
        {
          id: 202,
          title: 'APPS.ARCHITECTURE.TITLE',
          description: 'APPS.ARCHITECTURE.DESCRIPTION',
          parentId: 20,
          icon: 'building-house',
          subItems: [
            {
              id: 2021,
              parentId: 202,
              title: 'BASE.VALUES.TITLES',
              description: 'BASE.VALUES.DESCRIPTION',
              link: system.navigation.apps.architecture.values,
            },
            {
              id: 2022,
              parentId: 202,
              title: 'BASE.PRINCIPLES.TITLES',
              description: 'BASE.PRINCIPLES.DESCRIPTION',
              link: system.navigation.apps.architecture.principles,
            },
            {
              id: 2023,
              parentId: 202,
              title: 'BASE.QUALITIES.TITLES',
              description: 'BASE.QUALITIES.DESCRIPTION',
              link: system.navigation.apps.architecture.qualities,
            },
            {
              id: 2024,
              parentId: 202,
              title: 'BASE.PATTERNS.TITLES',
              description: 'BASE.PATTERNS.DESCRIPTION',
              link: system.navigation.apps.architecture.patterns,
            },
          ]
        }
      ]
    },

    {
      id: 203,
      title: 'APPS.EDUCATION.TITLE',
      description: 'APPS.EDUCATION.DESCRIPTION',
      parentId: 20,
      icon: 'navigation',
      subItems: [
        {
          id: 2031,
          title: 'BASE.PRODUCTS.TITLES',
          description: 'APPS.PRODUCTS.DESCRIPTION',
          link: system.navigation.apps.education.products.root,
          icon: 'package',
          parentId: 203
        },
        {
          id: 2032,
          title: 'BASE.PEOPLE.TITLES',
          description: 'APPS.PEOPLE.DESCRIPTION',
          icon: 'users',
          link: system.navigation.apps.education.people.root,
          parentId: 203, 
          subItems: [
            {
              id: 20321,
              title: 'BASE.DOMAINS.EDUCATION.ROLES.ALL',
              description: 'BASE.DOMAINS.EDUCATION.DESCRIPTION',
              link: system.navigation.apps.education.people.root,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20321,
              title: 'BASE.DOMAINS.EDUCATION.ROLES.LEARNERS',
              description: 'BASE.DOMAINS.EDUCATION.DESCRIPTION',
              link: system.navigation.apps.education.people.learners,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20321,
              title: 'BASE.DOMAINS.EDUCATION.ROLES.CARETAKERS',
              description: '...',
              link: system.navigation.apps.education.people.caretakers,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.DOMAINS.EDUCATION.ROLES.TEACHERS',
              description: '...',
              link: system.navigation.apps.education.people.teachers,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.DOMAINS.EDUCATION.ROLES.ADMINISTRATORS',
              description: '...',
              link: system.navigation.apps.education.people.administrators,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.DOMAINS.EDUCATION.ROLES.PRINCIPALS',
              description: '...',
              link: system.navigation.apps.education.people.principals,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.DOMAINS.EDUCATION.ROLES.SPECIALISTS',
              description: '...',
              link: system.navigation.apps.education.people.specialists,
              icon: 'map-pin',
              parentId: 20321
            },

            {
              id: 20323,
              title: 'BASE.DOMAINS.EDUCATION.TERMS.ALUMNI',
              description: '...',
              link: system.navigation.apps.education.people.alumni,
              icon: 'map-pin',
              parentId: 20321
            },
          ]
        },

        {
          id: 2033,
          title: 'BASE.PLACES.TITLES',
          description: '...',
          link: system.navigation.apps.education.places.root,
          icon: 'map-pin',
          parentId: 203
        },
        {
          id: 2034,
          title: 'BASE.ENROLLMENTS.TITLES',
          description: '...',
          link: system.navigation.apps.education.enrollments.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2035,
          title: 'BASE.FINANCES.TITLES',
          description: '...',
          link: system.navigation.apps.education.finances.root,
          icon: 'airplay',
          parentId: 203
        },

        {
          id: 2036,
          title: 'BASE.PRESENCE.TITLE',
          description: '...',
          link: system.navigation.apps.education.presence.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2037,
          title: 'BASE.PARTICIPATIONS.TITLE',
          description: '...',
          link: system.navigation.apps.education.participation.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2038,
          title: 'BASE.ASSESSMENTS.TITLES',
          description: '...',
          link: system.navigation.apps.education.assessments.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2039,
          title: 'BASE.PROGRESS.TITLE',
          description: '...',
          link: system.navigation.apps.education.progress.root,
          icon: 'chart',
          parentId: 203
        },
        {
          id: 2030,
          title: 'BASE.ACCOMPLISHMENTS.TITLES',
          description: '...',
          link: system.navigation.apps.education.accomplishments.root,
          icon: 'airplay',
          parentId: 203
        },
      ]
    },

    {
      id: 203,
      title: 'APPS.HEALTH.TITLE',
      description: '...',
      parentId: 20,
      icon: 'heart'
    },

    {
      id: 30,
      title: 'BASE.INFORMATION.TITLE',
      description: '...',
      icon: 'info',
      subItems: [
        {
          id: 301,
          parentId: 30,
          title: 'BASE.PRIVACY_POLICIES.TITLE',
          description: '...',
          link: system.navigation.pages.public.information.privacy,
        },
        {
          id: 302,
          parentId: 30,
          title: 'BASE.TERMS_AND_CONDITIONS.TITLE',
          description: '...',
          link: system.navigation.pages.public.information.terms,
        },
        {
          id: 303,
          parentId: 30,
          title: 'BASE.CORRECTIONS.TITLE',
          description: '...',
          link: system.navigation.pages.public.information.corrections,
        },
        {
          id: 304,
          parentId: 30,
          title: 'BASE.SUPPORT.TITLE',
          description: '...',
          link: system.navigation.pages.public.information.support,
        }
      ]
    },

    {
      id: 40,
      title: 'BASE.SETTINGS.TITLES',
      description: '...',
      icon: 'settings',
      subItems: [
        {
          id: 401,
          parentId: 40,
          title: 'BASE.SYSTEMS.TITLE',
          description: '...',
          link: system.navigation.settings.system,
        },
        {
          id: 402,
          parentId: 40,
          title: 'BASE.TENANCIES.TITLES',
          description: '...',
          link: system.navigation.settings.tenancy,
        },
        {
          id: 403,
          parentId: 40,
          title: 'BASE.GROUPS.TITLES',
          description: '...',
          link: system.navigation.settings.group,
        },
        {
          id: 404,
          parentId: 40,
          title: 'BASE.USERS.TITLES',
          description: '...',
          link: system.navigation.settings.user,
        }
      ]
    }

  ];
