import { IHasMenuItem } from '../models/contracts/IHasMenuItem';
// Constants:

import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';


export const MENU: IHasMenuItem[] =
  [
    {
      id: 10,
      title: 'BASE.DASHBOARDS.PLURAL',
      description: 'BASE.DASHBOARD.DESCRIPTION',
      icon: 'home',
      link: appsConfiguration.navigation.dashboards.root,
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
          link: appsConfiguration.navigation.apps.spikes.root,
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
              link: appsConfiguration.navigation.apps.architecture.values,
            },
            {
              id: 2022,
              parentId: 202,
              title: 'BASE.PRINCIPLES.PLURAL',
              description: 'BASE.PRINCIPLES.DESCRIPTION',
              link: appsConfiguration.navigation.apps.architecture.principles,
            },
            {
              id: 2023,
              parentId: 202,
              title: 'BASE.QUALITIES.PLURAL',
              description: 'BASE.QUALITIES.DESCRIPTION',
              link: appsConfiguration.navigation.apps.architecture.qualities,
            },
            {
              id: 2024,
              parentId: 202,
              title: 'BASE.PATTERNS.PLURAL',
              description: 'BASE.PATTERNS.DESCRIPTION',
              link: appsConfiguration.navigation.apps.architecture.patterns,
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
          link: appsConfiguration.navigation.apps.education.products.root,
          icon: 'package',
          parentId: 203
        },
        {
          id: 2032,
          title: 'BASE.PEOPLE.SINGULAR',
          description: 'APPS.PEOPLE.DESCRIPTION',
          icon: 'users',
          link: appsConfiguration.navigation.apps.education.people.root,
          parentId: 203, 
          subItems: [
            {
              id: 20321,
              title: 'BASE.EDUCATION.ROLES.ALL',
              description: 'BASE.EDUCATION.DESCRIPTION',
              link: appsConfiguration.navigation.apps.education.people.root,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20321,
              title: 'BASE.EDUCATION.ROLES.LEARNERS',
              description: 'BASE.EDUCATION.DESCRIPTION',
              link: appsConfiguration.navigation.apps.education.people.learners,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20321,
              title: 'BASE.EDUCATION.ROLES.CARETAKERS',
              description: '...',
              link: appsConfiguration.navigation.apps.education.people.caretakers,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.EDUCATION.ROLES.TEACHERS',
              description: '...',
              link: appsConfiguration.navigation.apps.education.people.teachers,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.EDUCATION.ROLES.ADMINISTRATORS',
              description: '...',
              link: appsConfiguration.navigation.apps.education.people.administrators,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.EDUCATION.ROLES.PRINCIPALS',
              description: '...',
              link: appsConfiguration.navigation.apps.education.people.principals,
              icon: 'map-pin',
              parentId: 20321
            },
            {
              id: 20322,
              title: 'BASE.EDUCATION.ROLES.SPECIALISTS',
              description: '...',
              link: appsConfiguration.navigation.apps.education.people.specialists,
              icon: 'map-pin',
              parentId: 20321
            },

            {
              id: 20323,
              title: 'BASE.EDUCATION.TERMS.ALUMNI',
              description: '...',
              link: appsConfiguration.navigation.apps.education.people.alumni,
              icon: 'map-pin',
              parentId: 20321
            },
          ]
        },

        {
          id: 2033,
          title: 'BASE.PLACES.PLURAL',
          description: '...',
          link: appsConfiguration.navigation.apps.education.places.root,
          icon: 'map-pin',
          parentId: 203
        },
        {
          id: 2034,
          title: 'BASE.ENROLLMENTS.PLURAL',
          description: '...',
          link: appsConfiguration.navigation.apps.education.enrollments.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2035,
          title: 'BASE.FINANCES.PLURAL',
          description: '...',
          link: appsConfiguration.navigation.apps.education.finances.root,
          icon: 'airplay',
          parentId: 203
        },

        {
          id: 2036,
          title: 'BASE.PRESENCE.SINGULAR',
          description: '...',
          link: appsConfiguration.navigation.apps.education.presence.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2037,
          title: 'BASE.PARTICIPATIONS.SINGULAR',
          description: '...',
          link: appsConfiguration.navigation.apps.education.participation.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2038,
          title: 'BASE.ASSESSMENTS.PLURAL',
          description: '...',
          link: appsConfiguration.navigation.apps.education.assessments.root,
          icon: 'airplay',
          parentId: 203
        },
        {
          id: 2039,
          title: 'BASE.PROGRESS.SINGULAR',
          description: '...',
          link: appsConfiguration.navigation.apps.education.progress.root,
          icon: 'chart',
          parentId: 203
        },
        {
          id: 2030,
          title: 'BASE.ACCOMPLISHMENTS.PLURAL',
          description: '...',
          link: appsConfiguration.navigation.apps.education.accomplishments.root,
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
      title: 'BASE.INFORMATIONS.SINGULAR',
      description: '...',
      icon: 'info',
      subItems: [
        {
          id: 301,
          parentId: 30,
          title: 'BASE.POLICIES.PRIVACY',
          description: '...',
          link: appsConfiguration.navigation.pages.open.information.service.privacy,
        },
        {
          id: 302,
          parentId: 30,
          title: 'BASE.TERMS.TERMS_AND_CONDITIONS',
          description: '...',
          link: appsConfiguration.navigation.pages.open.information.service.terms,
        },
        {
          id: 303,
          parentId: 30,
          title: 'BASE.CORRECTIONS.PLURAL',
          description: '...',
          link: appsConfiguration.navigation.pages.open.information.service.corrections,
        },
        {
          id: 304,
          parentId: 30,
          title: 'BASE.SUPPORT.SINGULAR',
          description: '...',
          link: appsConfiguration.navigation.pages.open.information.service.support,
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
          link: appsConfiguration.navigation.settings.system,
        },
        {
          id: 402,
          parentId: 40,
          title: 'BASE.ACCOUNTS.PLURAL',
          description: '...',
          link: appsConfiguration.navigation.settings.tenancy,
        },
        {
          id: 403,
          parentId: 40,
          title: 'BASE.GROUPS.PLURAL',
          description: '...',
          link: appsConfiguration.navigation.settings.group,
        },
        {
          id: 404,
          parentId: 40,
          title: 'BASE.USERS.PLURAL',
          description: '...',
          link: appsConfiguration.navigation.settings.user,
        }
      ]
    }

  ];
