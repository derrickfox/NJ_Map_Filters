// AI_CHANGE:
// Tool: Codex
// Model: GPT-5
// Timestamp: 2026-06-08T14:33:26-04:00
// Purpose: Defines labels, colors, and derived species rules for the Forest Composition layer.
// Reason: The layer now uses real NJDEP 2015 land-use/land-cover polygons, so only interpretation metadata should live locally.
export const treeLayerModes = [
  { id: 'forestType', label: 'Forest / Land Cover' },
  { id: 'dominantSpecies', label: 'Dominant Species Estimate' },
  { id: 'abundance', label: 'Species Abundance Estimate' }
];

export const treeLayerMetadata = {
  status: 'Real NJDEP 2015 LU/LC polygons; species views are derived estimates',
  source:
    'NJDEP Land Use/Land Cover 2015, Features/Land_lu MapServer layer 13. The app fetches major statewide patches of 500 acres or larger.',
  limitation:
    'Forest and land-cover shapes are real NJDEP polygons. Dominant species and abundance are estimated from LU/LC class, coarse geography, and ecological pattern rules, not field-verified species surveys.'
};

export const forestTypeDefinitions = {
  deciduousForest: {
    label: 'Deciduous Forest',
    color: '#4d7c0f',
    description:
      'NJDEP LU/LC deciduous forest polygons. These often include oak, hickory, maple, tulip poplar, beech, and other hardwood communities.'
  },
  coniferousForest: {
    label: 'Coniferous Forest',
    color: '#166534',
    description:
      'NJDEP LU/LC coniferous forest polygons. In southern New Jersey this often overlaps with Pine Barrens pine communities.'
  },
  mixedForest: {
    label: 'Mixed Deciduous / Coniferous Forest',
    color: '#2f6f3e',
    description:
      'NJDEP LU/LC mixed forest polygons where hardwoods and conifers are both important canopy components.'
  },
  shrubForest: {
    label: 'Brush / Shrubland Forest',
    color: '#6b8e23',
    description:
      'Shrubby or regenerating forest-like cover, often transitional after disturbance or in dry coastal plain settings.'
  },
  woodedWetland: {
    label: 'Wooded Wetland',
    color: '#0f766e',
    description:
      'Forested wetland classes from NJDEP LU/LC, including deciduous, coniferous, or mixed wooded wetlands.'
  },
  marshWetland: {
    label: 'Marsh / Wetland',
    color: '#0e7490',
    description:
      'Non-forested wetland classes such as saline marsh and other herbaceous wetland communities.'
  },
  urbanTreeCover: {
    label: 'Urban / Developed Context',
    color: '#64748b',
    description:
      'Large developed LU/LC polygons included as context; these are not forest-composition polygons.'
  },
  agriculturalOpen: {
    label: 'Agricultural / Open Land',
    color: '#c2a45f',
    description:
      'Large agricultural or open-land LU/LC polygons included as landscape context.'
  },
  waterNonForest: {
    label: 'Water / Non-Forest',
    color: '#60a5fa',
    description:
      'Large water polygons included as context so forest and wetland patterns are easier to read.'
  },
  barrenOther: {
    label: 'Barren / Other Non-Forest',
    color: '#a8a29e',
    description:
      'Large non-forest LU/LC polygons that do not fit the other simplified tree-layer categories.'
  }
};

export const speciesDefinitions = {
  pitchPine: {
    label: 'Pitch Pine',
    color: '#2f855a',
    description:
      'Common in the New Jersey Pine Barrens and adapted to sandy, acidic soils and periodic fire.'
  },
  whiteOak: {
    label: 'White Oak',
    color: '#84a98c',
    description:
      'A long-lived oak of upland hardwood forests, often mixed with other oaks and hickories.'
  },
  redOakGroup: {
    label: 'Red Oak group',
    color: '#b45309',
    description:
      'A grouped estimate for red oak relatives that often appear in upland hardwood forests.'
  },
  blackScarletOak: {
    label: 'Black Oak / Scarlet Oak group',
    color: '#92400e',
    description:
      'Dry-site oaks that can be prominent on sandy or rocky uplands, especially in oak-pine settings.'
  },
  hickoryGroup: {
    label: 'Hickory group',
    color: '#a16207',
    description:
      'A hardwood group commonly associated with oak-hickory forests in upland settings.'
  },
  tulipPoplar: {
    label: 'Tulip Poplar',
    color: '#65a30d',
    description:
      'A fast-growing hardwood often found in richer, moist soils and mixed hardwood forests.'
  },
  sweetgum: {
    label: 'Sweetgum',
    color: '#be7c2b',
    description:
      'A coastal plain hardwood often associated with moist lowland forests and disturbed sites.'
  },
  redMaple: {
    label: 'Red Maple',
    color: '#dc2626',
    description:
      'A highly adaptable tree found from wetland forests to uplands and developed landscapes.'
  },
  americanBeech: {
    label: 'American Beech',
    color: '#d4a373',
    description:
      'A shade-tolerant hardwood often found in mature mixed forests on mesic soils.'
  },
  atlanticWhiteCedar: {
    label: 'Atlantic White Cedar',
    color: '#0891b2',
    description:
      'A wetland conifer found in swampy areas, especially in the Pine Barrens and coastal plain.'
  },
  easternHemlock: {
    label: 'Eastern Hemlock',
    color: '#14532d',
    description:
      'A cool, shaded ravine and northern forest conifer, more likely in northern New Jersey settings.'
  },
  easternRedCedar: {
    label: 'Eastern Red Cedar',
    color: '#047857',
    description:
      'A drought-tolerant conifer common in old fields, edges, limestone areas, and open uplands.'
  },
  mixed: {
    label: 'Mixed / No clear dominant species',
    color: '#78716c',
    description:
      'A mixed or non-forest class where no single tree species group should be inferred.'
  }
};

export const abundanceScale = {
  none: { label: 'No data / not observed', color: '#e5e7eb', opacity: 0.12 },
  low: { label: 'Low estimate', color: '#d9f99d', opacity: 0.22 },
  moderate: { label: 'Moderate estimate', color: '#86efac', opacity: 0.36 },
  high: { label: 'High estimate', color: '#22c55e', opacity: 0.5 },
  veryHigh: { label: 'Very high estimate', color: '#166534', opacity: 0.66 }
};

export const abundanceSpeciesOptions = [
  'pitchPine',
  'whiteOak',
  'redOakGroup',
  'hickoryGroup',
  'redMaple',
  'tulipPoplar',
  'sweetgum',
  'americanBeech',
  'atlanticWhiteCedar',
  'easternHemlock',
  'easternRedCedar'
];
