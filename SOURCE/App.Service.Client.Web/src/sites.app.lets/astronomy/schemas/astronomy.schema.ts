/**
 * Astronomy Entity Schemas
 * 
 * Schema-driven definitions for astronomy domain entities.
 * Uses EntitySchema to drive universal CRUD components.
 * 
 * Demonstrates relationship types:
 * - 1-* : StarSystem → Stars, StarSystem → Planets, Planet → Moons
 * - *-* : StarSystem ↔ Astronomer (discovery credits)
 * - *-1 : Planet → Star (orbits), Star → Constellation (IAU boundary)
 * - 1-1 : Planet → Atmosphere
 */

import { EntitySchema, EntityFieldDefinition } from '../../../core/models/schema/entity-schema.model';

// ═══════════════════════════════════════════════════════════════════
// STAR SYSTEM SCHEMA (Aggregate Root)
// ═══════════════════════════════════════════════════════════════════

const STAR_SYSTEM_FIELDS: EntityFieldDefinition[] = [
  {
    field: 'id',
    type: 'text',
    label: 'ID',
    isIdentifier: true,
    systemManaged: true,
    hidden: true,
  },
  {
    field: 'name',
    type: 'text',
    label: 'Name',
    isPrimary: true,
    browsable: true,
    sortable: true,
    filterable: true,
    searchable: true,
    searchWeight: 10,
    required: true,
    maxLength: 200,
    placeholder: 'e.g., Solar System, Alpha Centauri',
    helpText: 'The common name of the star system',
    layout: { colSpan: 12 },
  },
  {
    field: 'description',
    type: 'textarea',
    label: 'Description',
    browsable: false,
    searchable: true,
    searchWeight: 5,
    rows: 3,
    placeholder: 'Describe the star system...',
    layout: { colSpan: 12 },
  },
  {
    field: 'distanceFromEarth',
    type: 'number',
    label: 'Distance (light years)',
    browsable: true,
    sortable: true,
    filterable: true,
    summary: true,
    min: 0,
    helpText: 'Distance from Earth in light years',
    layout: { colSpan: 6 },
  },
  {
      field: 'discoveredAt',
      type: 'date',
      label: 'Discovery Date',
      browsable: true,
      sortable: true,
      filterable: true,
      layout: { colSpan: 6 },
    },
    {
      field: 'starType',
      type: 'select',
      label: 'Star Type',
      browsable: true,
      sortable: true,
      filterable: true,
      summary: true,
      helpText: 'The spectral classification of the primary star',
      options: [
        { value: 'red-dwarf', label: 'Red Dwarf (M-type)' },
        { value: 'yellow-dwarf', label: 'Yellow Dwarf (G-type, like our Sun)' },
        { value: 'orange-dwarf', label: 'Orange Dwarf (K-type)' },
        { value: 'blue-giant', label: 'Blue Giant (O/B-type)' },
        { value: 'white-dwarf', label: 'White Dwarf' },
        { value: 'red-giant', label: 'Red Giant' },
        { value: 'neutron', label: 'Neutron Star' },
      ],
      layout: { colSpan: 6 },
    },
  ];

export const STAR_SYSTEM_ENTITY_SCHEMA: EntitySchema = {
  dslVersion: '1.0.0',
  id: 'starSystem',
  name: 'Star System',
  namePlural: 'Star Systems',
  description: 'A star and its orbiting bodies',
  icon: 'bx-sun',
  color: '#f7b84b',
  
  fields: STAR_SYSTEM_FIELDS,
  
  views: {
    browse: {
      version: '1.0',
      id: 'star-system-browse',
      name: 'Star Systems',
      title: 'Star Systems',
      search: {
        enabled: true,
        placeholder: 'Search star systems...',
        searchFields: ['name', 'description'],
        minLength: 2,
        debounceMs: 300,
      },
      filter: {
        enabled: true,
        expanded: false,
        fields: STAR_SYSTEM_FIELDS.filter(f => f.filterable) as any,
      },
      order: {
        enabled: true,
        expanded: false,
        fields: STAR_SYSTEM_FIELDS.filter(f => f.sortable) as any,
        defaultSort: { id: 'default', field: 'name', direction: 'asc' },
      },
      display: {
        enabled: true,
        availableModes: ['cards', 'table', 'list'],
        defaultMode: 'cards',
        columns: [
          { field: 'name', label: 'Name', sortable: true },
          { field: 'distanceFromEarth', label: 'Distance (ly)', sortable: true },
          { field: 'discoveredAt', label: 'Discovered', sortable: true },
        ] as any,
      },
      pagination: {
        enabled: true,
        pageSize: 12,
        pageSizeOptions: [6, 12, 24, 48],
      },
      emptyState: {
        message: 'No star systems found',
        icon: 'bx-sun',
        showAddButton: true,
        addButtonLabel: 'Add Star System',
      },
    },
    edit: {
      version: '1.0',
      id: 'star-system-edit',
      name: 'Edit Star System',
      titleTemplate: 'Edit: {{name}}',
      icon: 'bx-pencil',
      fields: STAR_SYSTEM_FIELDS.filter(f => !f.systemManaged),
      tabs: [
        { 
          id: 'details', 
          label: 'Details', 
          icon: 'bx-info-circle', 
          fields: ['name', 'description', 'starType', 'distanceFromEarth', 'discoveredAt'] 
        },
      ],
    },
  },
  
  dataSource: {
    endpoint: '/api/astronomy/star-systems',
    idField: 'id',
  },
};

// ═══════════════════════════════════════════════════════════════════
// PLANET SCHEMA
// ═══════════════════════════════════════════════════════════════════

const PLANET_FIELDS: EntityFieldDefinition[] = [
  {
    field: 'id',
    type: 'text',
    label: 'ID',
    isIdentifier: true,
    systemManaged: true,
    hidden: true,
  },
  {
    field: 'name',
    type: 'text',
    label: 'Name',
    isPrimary: true,
    browsable: true,
    sortable: true,
    filterable: true,
    searchable: true,
    searchWeight: 10,
    required: true,
    maxLength: 200,
    placeholder: 'e.g., Earth, Mars, Proxima b',
    layout: { colSpan: 12 },
  },
  {
    field: 'type',
    type: 'select',
    label: 'Planet Type',
    browsable: true,
    sortable: true,
    filterable: true,
    summary: true,
    required: true,
    options: [
      { value: 'rocky', label: 'Rocky' },
      { value: 'gas-giant', label: 'Gas Giant' },
      { value: 'ice-giant', label: 'Ice Giant' },
      { value: 'dwarf', label: 'Dwarf Planet' },
    ],
    layout: { colSpan: 6 },
  },
  {
    field: 'habitableZone',
    type: 'toggle',
    label: 'In Habitable Zone',
    browsable: true,
    filterable: true,
    summary: true,
    layout: { colSpan: 6 },
  },
  // *-1 relationship to Star
  {
    field: 'orbitsStarId',
    type: 'select',
    label: 'Orbits Star',
    browsable: true,
    filterable: true,
    required: true,
    helpText: 'The star this planet orbits (*-1 relationship)',
    optionsSource: {
      api: {
        endpoint: '/api/astronomy/stars',
        valueField: 'id',
        labelField: 'name',
      },
    },
    layout: { colSpan: 12 },
  },
  {
    field: 'distanceFromStar',
    type: 'number',
    label: 'Distance from Star (AU)',
    browsable: true,
    sortable: true,
    min: 0,
    step: 0.01,
    helpText: 'Astronomical Units from parent star',
    layout: { colSpan: 6 },
  },
  {
    field: 'orbitalPeriod',
    type: 'number',
    label: 'Orbital Period (days)',
    browsable: true,
    sortable: true,
    min: 0,
    helpText: 'Length of year in Earth days',
    layout: { colSpan: 6 },
  },
  {
    field: 'radius',
    type: 'number',
    label: 'Radius (Earth radii)',
    browsable: false,
    min: 0,
    step: 0.01,
    layout: { colSpan: 4 },
  },
  {
    field: 'mass',
    type: 'number',
    label: 'Mass (Earth masses)',
    browsable: false,
    min: 0,
    step: 0.01,
    layout: { colSpan: 4 },
  },
  {
    field: 'rings',
    type: 'toggle',
    label: 'Has Rings',
    browsable: true,
    filterable: true,
    layout: { colSpan: 4 },
  },
];

export const PLANET_ENTITY_SCHEMA: EntitySchema = {
  dslVersion: '1.0.0',
  id: 'planet',
  name: 'Planet',
  namePlural: 'Planets',
  description: 'A celestial body orbiting a star',
  icon: 'bx-planet',
  color: '#299cdb',
  
  fields: PLANET_FIELDS,
  
  views: {
    browse: {
      version: '1.0',
      id: 'planet-browse',
      name: 'Planets',
      title: 'Planets',
      search: {
        enabled: true,
        placeholder: 'Search planets...',
        searchFields: ['name'],
        minLength: 2,
        debounceMs: 300,
      },
      filter: {
        enabled: true,
        expanded: false,
        fields: PLANET_FIELDS.filter(f => f.filterable) as any,
      },
      order: {
        enabled: true,
        expanded: false,
        fields: PLANET_FIELDS.filter(f => f.sortable) as any,
        defaultSort: { id: 'default', field: 'name', direction: 'asc' },
      },
      display: {
        enabled: true,
        availableModes: ['cards', 'table', 'list'],
        defaultMode: 'cards',
        columns: [
          { field: 'name', label: 'Name', sortable: true },
          { field: 'type', label: 'Type', sortable: true },
          { field: 'habitableZone', label: 'Habitable', sortable: false },
          { field: 'orbitalPeriod', label: 'Orbital Period', sortable: true },
        ] as any,
      },
      pagination: {
        enabled: true,
        pageSize: 12,
        pageSizeOptions: [6, 12, 24, 48],
      },
      emptyState: {
        message: 'No planets found',
        icon: 'bx-planet',
        showAddButton: true,
        addButtonLabel: 'Add Planet',
      },
    },
    edit: {
      version: '1.0',
      id: 'planet-edit',
      name: 'Edit Planet',
      titleTemplate: 'Edit: {{name}}',
      icon: 'bx-pencil',
      fields: PLANET_FIELDS.filter(f => !f.systemManaged),
      tabs: [
        { 
          id: 'orbital', 
          label: 'Orbital (*-1)', 
          icon: 'bx-sun', 
          fields: ['name', 'orbitsStarId', 'distanceFromStar', 'orbitalPeriod'] 
        },
        { 
          id: 'physical', 
          label: 'Physical', 
          icon: 'bx-planet', 
          fields: ['type', 'habitableZone', 'rings', 'radius', 'mass'] 
        },
      ],
    },
  },
  
  dataSource: {
    endpoint: '/api/astronomy/planets',
    idField: 'id',
  },
};

// ═══════════════════════════════════════════════════════════════════
// ASTRONOMER SCHEMA
// ═══════════════════════════════════════════════════════════════════

const ASTRONOMER_FIELDS: EntityFieldDefinition[] = [
  {
    field: 'id',
    type: 'text',
    label: 'ID',
    isIdentifier: true,
    systemManaged: true,
    hidden: true,
  },
  {
    field: 'name',
    type: 'text',
    label: 'Name',
    isPrimary: true,
    browsable: true,
    sortable: true,
    filterable: true,
    searchable: true,
    searchWeight: 10,
    required: true,
    maxLength: 200,
    layout: { colSpan: 12 },
  },
  {
    field: 'affiliation',
    type: 'text',
    label: 'Affiliation',
    browsable: true,
    searchable: true,
    placeholder: 'University or research institution',
    layout: { colSpan: 6 },
  },
  {
    field: 'country',
    type: 'text',
    label: 'Country',
    browsable: true,
    filterable: true,
    layout: { colSpan: 6 },
  },
  {
    field: 'specialization',
    type: 'text',
    label: 'Specialization',
    browsable: true,
    filterable: true,
    placeholder: 'e.g., Exoplanets, Double stars',
    layout: { colSpan: 12 },
  },
];

export const ASTRONOMER_ENTITY_SCHEMA: EntitySchema = {
  dslVersion: '1.0.0',
  id: 'astronomer',
  name: 'Astronomer',
  namePlural: 'Astronomers',
  description: 'Scientists who study celestial objects',
  icon: 'bx-user',
  color: '#405189',
  
  fields: ASTRONOMER_FIELDS,
  
  views: {
    browse: {
      version: '1.0',
      id: 'astronomer-browse',
      name: 'Astronomers',
      title: 'Astronomers',
      search: {
        enabled: true,
        placeholder: 'Search astronomers...',
        searchFields: ['name', 'affiliation'],
        minLength: 2,
        debounceMs: 300,
      },
      filter: {
        enabled: true,
        expanded: false,
        fields: ASTRONOMER_FIELDS.filter(f => f.filterable) as any,
      },
      order: {
        enabled: true,
        expanded: false,
        fields: ASTRONOMER_FIELDS.filter(f => f.sortable) as any,
        defaultSort: { id: 'default', field: 'name', direction: 'asc' },
      },
      display: {
        enabled: true,
        availableModes: ['table', 'cards', 'list'],
        defaultMode: 'table',
        columns: [
          { field: 'name', label: 'Name', sortable: true },
          { field: 'affiliation', label: 'Affiliation', sortable: true },
          { field: 'country', label: 'Country', sortable: true },
          { field: 'specialization', label: 'Specialization', sortable: true },
        ] as any,
      },
      pagination: {
        enabled: true,
        pageSize: 20,
        pageSizeOptions: [10, 20, 50, 100],
      },
      emptyState: {
        message: 'No astronomers found',
        icon: 'bx-user',
        showAddButton: true,
        addButtonLabel: 'Add Astronomer',
      },
    },
    edit: {
      version: '1.0',
      id: 'astronomer-edit',
      name: 'Edit Astronomer',
      titleTemplate: 'Edit: {{name}}',
      icon: 'bx-pencil',
      fields: ASTRONOMER_FIELDS.filter(f => !f.systemManaged),
      tabs: [
        { 
          id: 'info', 
          label: 'Information', 
          icon: 'bx-user', 
          fields: ['name', 'country', 'affiliation', 'specialization'] 
        },
      ],
    },
  },
  
  dataSource: {
    endpoint: '/api/astronomy/astronomers',
    idField: 'id',
  },
};

// ═══════════════════════════════════════════════════════════════════
// APPLET SCHEMA (Container for all entities)
// ═══════════════════════════════════════════════════════════════════

export const ASTRONOMY_APPLET_SCHEMA = {
  appletId: 'astronomy',
  appletName: 'Astronomy',
  icon: 'bx-planet',
  description: 'Explore star systems, planets, and moons',
  
  entities: {
    starSystem: STAR_SYSTEM_ENTITY_SCHEMA,
    planet: PLANET_ENTITY_SCHEMA,
    astronomer: ASTRONOMER_ENTITY_SCHEMA,
  },
  
  // Hub configuration
  hub: {
    tiles: [
      { entityId: 'starSystem', icon: 'bx-sun', color: 'warning' },
      { entityId: 'planet', icon: 'bx-planet', color: 'info' },
      { entityId: 'astronomer', icon: 'bx-user', color: 'primary' },
    ],
    showRelationshipDiagram: true,
  },
  
  // Default routing
  defaultView: 'hub', // 'hub' | 'browse' | entityId
};
