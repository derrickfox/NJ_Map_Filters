import React, { useEffect, useMemo, useRef } from 'react';
import { CircleMarker, GeoJSON, MapContainer, Marker, Polygon, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {
  abundanceScale,
  forestTypeDefinitions,
  speciesDefinitions,
  treeLayerMetadata
} from '../data/treeCompositionRules.js';

const defaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const NJ_CENTER = [40.143, -75.22];
const FIT_PADDING = [4, 4];
const MAX_BOUNDS_PADDING_RATIO = 2.2;
const WORLD_MASK_RING = [
  [89, -179],
  [89, 179],
  [-89, 179],
  [-89, -179]
];
const BASEMAPS = {
  plain: {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
  },
  terrain: {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Map style &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  }
};
const HIGH_RELIEF_BASE_LAYER = {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
};
const HIGH_RELIEF_TEXTURE_LAYER = {
  attribution: 'Relief tiles &copy; Mapzen terrain tiles contributors',
  url: 'https://s3.amazonaws.com/elevation-tiles-prod/normal/{z}/{x}/{y}.png'
};
const COUNTY_COLORS = [
  '#2563eb',
  '#16a34a',
  '#f97316',
  '#9333ea',
  '#0891b2',
  '#dc2626',
  '#0f766e',
  '#ca8a04',
  '#4f46e5',
  '#db2777'
];

function getCountyName(feature) {
  return (
    feature?.properties?.COUNTY ||
    feature?.properties?.COUNTY_NAM ||
    feature?.properties?.COUNTY_LABEL ||
    feature?.properties?.NAME ||
    'Unknown County'
  );
}

function getCountySeat(feature) {
  return feature?.properties?.COUNTY_SEAT || feature?.properties?.SEAT || feature?.properties?.CNTY_SEAT || '';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ringToLatLngs(ring) {
  return ring.map(([lng, lat]) => [lat, lng]);
}

function FitCountyBounds({ countyData, isLeftAligned }) {
  const map = useMap();

  useEffect(() => {
    if (!countyData?.features?.length) return;
    const bounds = L.geoJSON(countyData).getBounds();
    if (bounds.isValid()) {
      // AI_CHANGE:
      // Tool: Codex
      // Model: GPT-5
      // Timestamp: 2026-06-08T12:36:40-04:00
      // Purpose: Keeps New Jersey constrained while the initial center offsets the state away from the docked filter panel.
      // Reason: The basemap should stay full-bleed behind the panel, but the NJ outline should not load underneath the controls.
      const fitZoom = map.getBoundsZoom(bounds, false, FIT_PADDING);
      map.setMaxBounds(bounds.pad(MAX_BOUNDS_PADDING_RATIO));
      map.setMinZoom(fitZoom);
    }

  }, [countyData, isLeftAligned, map]);

  return null;
}

function CountyLabels({ features }) {
  return features.map((feature) => {
    const bounds = L.geoJSON(feature).getBounds();
    if (!bounds.isValid()) return null;
    const center = bounds.getCenter();
    const name = getCountyName(feature).replace(/\s+County$/i, '');
    const labelIcon = L.divIcon({
      className: 'county-label-marker',
      html: `<span class="county-label">${escapeHtml(name)}</span>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    return (
      <Marker
        key={`label-${name}`}
        position={[center.lat, center.lng]}
        icon={labelIcon}
        interactive={false}
      />
    );
  });
}

function buildStateMaskPositions(countyData) {
  if (!countyData?.features?.length) return null;

  const stateHoles = countyData.features.flatMap((feature) => {
    const geometry = feature.geometry;
    if (!geometry) return [];

    if (geometry.type === 'Polygon') {
      return geometry.coordinates[0] ? [ringToLatLngs(geometry.coordinates[0])] : [];
    }

    if (geometry.type === 'MultiPolygon') {
      return geometry.coordinates
        .map((polygon) => polygon[0])
        .filter(Boolean)
        .map(ringToLatLngs);
    }

    return [];
  });

  return [WORLD_MASK_RING, ...stateHoles];
}

function getCanalGroup(feature) {
  return feature?.properties?.STATUS === 'Active' ? 'current' : 'historic';
}

function formatCanalValue(value) {
  return value ? escapeHtml(value) : 'Not listed';
}

function formatTreeList(values) {
  if (!Array.isArray(values) || values.length === 0) return 'Not listed';
  return values.map((value) => speciesDefinitions[value]?.label || value).join(', ');
}

function getLandCoverCategory(properties = {}) {
  const type = String(properties.TYPE15 || '').toUpperCase();
  const label = String(properties.LABEL15 || '').toUpperCase();

  if (type === 'FOREST') {
    if (label.includes('MIXED')) return 'mixedForest';
    if (label.includes('CONIFEROUS')) return label.includes('BRUSH') ? 'shrubForest' : 'coniferousForest';
    if (label.includes('BRUSH') || label.includes('SHRUB')) return 'shrubForest';
    return 'deciduousForest';
  }

  if (type === 'WETLANDS') {
    if (label.includes('WOODED')) return 'woodedWetland';
    return 'marshWetland';
  }

  if (type === 'AGRICULTURE') return 'agriculturalOpen';
  if (type === 'URBAN') return 'urbanTreeCover';
  if (type === 'WATER') return 'waterNonForest';
  return 'barrenOther';
}

function getFeatureCenter(feature) {
  const bounds = L.geoJSON(feature).getBounds();
  return bounds.isValid() ? bounds.getCenter() : null;
}

function deriveDominantSpecies(feature) {
  const properties = feature?.properties || {};
  const category = getLandCoverCategory(properties);
  const label = String(properties.LABEL15 || '').toUpperCase();
  const center = getFeatureCenter(feature);
  const isSouth = center ? center.lat < 40.15 : false;
  const isCoastalPlain = center ? center.lng > -75.05 && center.lat < 40.35 : false;
  const isNorth = center ? center.lat > 40.65 : false;

  if (category === 'coniferousForest') return isSouth || isCoastalPlain ? 'pitchPine' : 'easternHemlock';
  if (category === 'mixedForest') return isSouth ? 'blackScarletOak' : 'redOakGroup';
  if (category === 'shrubForest') return isSouth ? 'pitchPine' : 'easternRedCedar';
  if (category === 'woodedWetland') {
    if (label.includes('CONIFEROUS')) return 'atlanticWhiteCedar';
    return isSouth ? 'redMaple' : 'sweetgum';
  }
  if (category === 'marshWetland') return 'mixed';
  if (category === 'deciduousForest') {
    if (isNorth) return 'redOakGroup';
    if (isCoastalPlain) return 'blackScarletOak';
    return 'whiteOak';
  }
  if (category === 'urbanTreeCover') return 'redMaple';
  if (category === 'agriculturalOpen') return 'easternRedCedar';
  return 'mixed';
}

function getSecondarySpecies(feature) {
  const category = getLandCoverCategory(feature?.properties);
  const dominant = deriveDominantSpecies(feature);
  const secondaryByCategory = {
    deciduousForest: ['whiteOak', 'redOakGroup', 'hickoryGroup', 'tulipPoplar', 'americanBeech'],
    coniferousForest: ['pitchPine', 'easternRedCedar', 'redMaple'],
    mixedForest: ['pitchPine', 'whiteOak', 'blackScarletOak', 'redMaple'],
    shrubForest: ['pitchPine', 'blackScarletOak', 'easternRedCedar'],
    woodedWetland: ['redMaple', 'sweetgum', 'atlanticWhiteCedar'],
    marshWetland: ['redMaple', 'sweetgum', 'atlanticWhiteCedar'],
    urbanTreeCover: ['redMaple', 'tulipPoplar', 'whiteOak'],
    agriculturalOpen: ['easternRedCedar', 'redMaple', 'whiteOak'],
    waterNonForest: [],
    barrenOther: []
  };

  return (secondaryByCategory[category] || []).filter((species) => species !== dominant).slice(0, 3);
}

function getSpeciesAbundance(feature, speciesKey) {
  const category = getLandCoverCategory(feature?.properties);
  const dominant = deriveDominantSpecies(feature);
  const secondary = getSecondarySpecies(feature);

  if (dominant === speciesKey) return category === 'coniferousForest' || category === 'woodedWetland' ? 'veryHigh' : 'high';
  if (secondary.includes(speciesKey)) return 'moderate';
  if (category === 'deciduousForest' && ['redMaple', 'whiteOak', 'redOakGroup', 'hickoryGroup', 'tulipPoplar'].includes(speciesKey)) return 'low';
  if (category === 'mixedForest' && ['pitchPine', 'whiteOak', 'redOakGroup', 'redMaple'].includes(speciesKey)) return 'low';
  if (category === 'woodedWetland' && ['redMaple', 'sweetgum', 'atlanticWhiteCedar'].includes(speciesKey)) return 'low';
  return 'none';
}

function getPointLatLng(feature) {
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const [lng, lat] = coordinates;
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
}

export default function MapArea({
  activeLayers,
  countyData,
  canalData,
  canalVisibility,
  historicRailData,
  borderHistoricCanals,
  parkData,
  municipalityData,
  railData,
  historicalSiteData,
  treeLandCoverData,
  treeLayerMode,
  treeSpecies,
  attractionLocations,
  weirdNjLocations,
  hiddenCounties,
  selectedCounty,
  setSelectedCounty,
  searchQuery,
  isLeftAligned,
  baseMap,
  loadingLayers = []
}) {
  const geoJsonLayerRef = useRef(null);
  const selectedBaseMap = BASEMAPS[baseMap] || BASEMAPS.plain;

  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T12:06:08-04:00
  // Purpose: Renders New Jersey county polygons as the app's initial geographic layer.
  // Reason: The New Jersey variant needs county-level filtering before any additional map layers are added.
  const visibleCountyData = useMemo(() => {
    if (!countyData?.features?.length) return null;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return {
      ...countyData,
      features: countyData.features.filter((feature) => {
        const name = getCountyName(feature);
        if (hiddenCounties.has(name)) return false;
        if (!normalizedQuery) return true;
        return name.toLowerCase().includes(normalizedQuery);
      })
    };
  }, [countyData, hiddenCounties, searchQuery]);

  const colorByCounty = useMemo(() => {
    const map = new Map();
    countyData?.features?.forEach((feature, index) => {
      map.set(getCountyName(feature), COUNTY_COLORS[index % COUNTY_COLORS.length]);
    });
    return map;
  }, [countyData]);

  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T12:15:28-04:00
  // Purpose: Builds an outside-New-Jersey mask from county geometry holes.
  // Reason: Dimming the surrounding region makes the NJ county layer read as the highlighted focus area.
  const stateMaskPositions = useMemo(() => buildStateMaskPositions(countyData), [countyData]);

  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T12:15:28-04:00
  // Purpose: Filters NJDEP canal/raceway features into current and historic visibility groups.
  // Reason: The Canals & Historic RR layer needs to show active waterways and inactive historic canal remnants independently.
  const visibleCanalData = useMemo(() => {
    if (!canalData?.features?.length) return null;

    return {
      ...canalData,
      features: canalData.features.filter((feature) => canalVisibility[getCanalGroup(feature)])
    };
  }, [canalData, canalVisibility]);

  const canalStyle = (feature) => {
    const isCurrent = getCanalGroup(feature) === 'current';

    return {
      color: isCurrent ? '#0284c7' : '#b45309',
      weight: isCurrent ? 2 : 1.6,
      opacity: isCurrent ? 0.95 : 0.78,
      fillColor: isCurrent ? '#38bdf8' : '#f59e0b',
      fillOpacity: isCurrent ? 0.42 : 0.34,
      dashArray: isCurrent ? null : '6 5'
    };
  };

  const onEachCanal = (feature, layer) => {
    const properties = feature.properties || {};
    const name = formatCanalValue(properties.NAME || 'Unnamed canal');

    layer.bindPopup(`
      <div class="canal-popup">
        <div class="canal-popup__name">${name}</div>
        <div class="canal-popup__row"><strong>Status:</strong> ${formatCanalValue(properties.STATUS)}</div>
        <div class="canal-popup__row"><strong>Type:</strong> ${formatCanalValue(properties.TYPE)}</div>
        <div class="canal-popup__row"><strong>Purpose:</strong> ${formatCanalValue(properties.PURPOSE)}</div>
        <div class="canal-popup__row"><strong>Condition:</strong> ${formatCanalValue(properties.CONDITION)}</div>
        <div class="canal-popup__row"><strong>County:</strong> ${formatCanalValue(properties.COUNTY)}</div>
      </div>
    `);
  };

  function getRailStatusLabel(status) {
    if (status === '2') return 'Out of Service';
    if (status === '3') return 'Abandoned';
    if (status === '4') return 'Converted to Trail';
    return status === '1' ? 'Active' : 'Not listed';
  }

  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T13:57:00-04:00
  // Purpose: Styles inactive railroad corridors inside the combined Canals & Historic RR layer.
  // Reason: Users asked to add historic train routes that are likely no longer in service alongside canal history.
  const historicRailStyle = {
    color: '#78350f',
    weight: 1.8,
    opacity: 0.78,
    dashArray: '2 6'
  };

  const onEachHistoricRail = (feature, layer) => {
    const properties = feature.properties || {};
    const name = formatCanalValue(properties.rr_name || properties.RR_ID || 'Historic rail corridor');
    const status = getRailStatusLabel(properties.RR_Status);
    const milepostRange =
      properties.MP_Start !== null && properties.MP_Start !== undefined && properties.MP_End !== null && properties.MP_End !== undefined
        ? `${properties.MP_Start} to ${properties.MP_End}`
        : 'Not listed';

    layer.bindPopup(`
      <div class="historic-rail-popup">
        <div class="historic-rail-popup__name">${name}</div>
        <div class="historic-rail-popup__row"><strong>Status:</strong> ${formatCanalValue(status)}</div>
        <div class="historic-rail-popup__row"><strong>Rail ID:</strong> ${formatCanalValue(properties.RR_ID)}</div>
        <div class="historic-rail-popup__row"><strong>Mileposts:</strong> ${formatCanalValue(milepostRange)}</div>
      </div>
    `);
  };

  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T13:57:00-04:00
  // Purpose: Styles non-NJ border historic canals inside the combined history layer.
  // Reason: Users asked to include historic canals near Port Jervis and Easton that border or terminate near New Jersey but are not NJDEP-attributed.
  const borderCanalStyle = {
    color: '#0f766e',
    weight: 2,
    opacity: 0.82,
    dashArray: '8 7'
  };

  const onEachBorderCanal = (feature, layer) => {
    const properties = feature.properties || {};
    const name = formatCanalValue(properties.NAME || 'Border historic canal');

    layer.bindPopup(`
      <div class="border-canal-popup">
        <div class="border-canal-popup__name">${name}</div>
        <div class="border-canal-popup__row"><strong>Status:</strong> ${formatCanalValue(properties.STATUS)}</div>
        <div class="border-canal-popup__row"><strong>Location:</strong> ${formatCanalValue(properties.LOCATION)}</div>
        <div class="border-canal-popup__row"><strong>Note:</strong> ${formatCanalValue(properties.NOTE)}</div>
        <a class="border-canal-popup__link" href="${escapeHtml(properties.SOURCE_URL || '#')}" target="_blank" rel="noreferrer">${formatCanalValue(properties.SOURCE_TITLE || 'Source')}</a>
      </div>
    `);
  };

  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T13:11:52-04:00
  // Purpose: Styles NJDEP park/open-space polygons as area overlays instead of point symbols.
  // Reason: Users expected the Parks layer to show coverage and overlap across the map, not pinpoint locations.
  const parkStyle = {
    color: '#15803d',
    weight: 1.2,
    opacity: 0.88,
    fillColor: '#22c55e',
    fillOpacity: 0.36
  };

  const onEachPark = (feature, layer) => {
    const properties = feature.properties || {};
    const name = formatCanalValue(
      properties.FEATURE_NAME || properties.NAME_LABEL || properties.FACILITY_USE || 'Unnamed park area'
    );

    layer.bindPopup(`
      <div class="park-popup">
        <div class="park-popup__name">${name}</div>
        <div class="park-popup__row"><strong>Use:</strong> ${formatCanalValue(properties.USE_DESIGNATION || properties.FACILITY_USE)}</div>
        <div class="park-popup__row"><strong>Manager:</strong> ${formatCanalValue(properties.LAND_MANAGER_AGENCY)}</div>
        <div class="park-popup__row"><strong>Ownership:</strong> ${formatCanalValue(properties.OWNERSHIP)}</div>
        <div class="park-popup__row"><strong>County:</strong> ${formatCanalValue(properties.COUNTY)}</div>
        <div class="park-popup__row"><strong>Acres:</strong> ${formatCanalValue(properties.ACRES_TEXT || properties.ACRES)}</div>
      </div>
    `);
  };

  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T13:17:49-04:00
  // Purpose: Styles NJ municipal polygons for the Towns & Cities area layer.
  // Reason: The layer should show statewide municipal coverage while remaining visually distinct from counties, parks, and canals.
  const municipalityStyle = {
    color: '#7c3aed',
    weight: 1,
    opacity: 0.82,
    fillColor: '#a78bfa',
    fillOpacity: 0.22
  };

  const onEachMunicipality = (feature, layer) => {
    const properties = feature.properties || {};
    const name = formatCanalValue(properties.MUN_LABEL || properties.NAME || 'Unnamed municipality');
    const squareMiles = Number.isFinite(properties.SQ_MILES)
      ? properties.SQ_MILES.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : properties.SQ_MILES;
    const population = Number.isFinite(properties.POP2020)
      ? properties.POP2020.toLocaleString()
      : properties.POP2020;
    const density = Number.isFinite(properties.POPDEN2020)
      ? properties.POPDEN2020.toLocaleString()
      : properties.POPDEN2020;

    layer.bindPopup(`
      <div class="municipality-popup">
        <div class="municipality-popup__name">${name}</div>
        <div class="municipality-popup__row"><strong>Type:</strong> ${formatCanalValue(properties.MUN_TYPE)}</div>
        <div class="municipality-popup__row"><strong>County:</strong> ${formatCanalValue(properties.COUNTY)}</div>
        <div class="municipality-popup__row"><strong>Area:</strong> ${formatCanalValue(squareMiles)} sq mi</div>
        <div class="municipality-popup__row"><strong>2020 population:</strong> ${formatCanalValue(population)}</div>
        <div class="municipality-popup__row"><strong>Density:</strong> ${formatCanalValue(density)} people/sq mi</div>
      </div>
    `);
  };

  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T13:49:31-04:00
  // Purpose: Styles currently active rail lines as a high-contrast line overlay.
  // Reason: Users requested operating railways, which should read as infrastructure lines rather than points or filled areas.
  const railStyle = {
    color: '#111827',
    weight: 2.3,
    opacity: 0.86,
    dashArray: '10 4'
  };

  const onEachRail = (feature, layer) => {
    const properties = feature.properties || {};
    const name = formatCanalValue(properties.rr_name || properties.RR_ID || 'Active rail line');
    const milepostRange =
      properties.MP_Start !== null && properties.MP_Start !== undefined && properties.MP_End !== null && properties.MP_End !== undefined
        ? `${properties.MP_Start} to ${properties.MP_End}`
        : 'Not listed';

    layer.bindPopup(`
      <div class="rail-popup">
        <div class="rail-popup__name">${name}</div>
        <div class="rail-popup__row"><strong>Status:</strong> Active</div>
        <div class="rail-popup__row"><strong>Rail ID:</strong> ${formatCanalValue(properties.RR_ID)}</div>
        <div class="rail-popup__row"><strong>Mileposts:</strong> ${formatCanalValue(milepostRange)}</div>
      </div>
    `);
  };

  function getHistoricalStatusLabel(status) {
    if (status === 'NHL_INDV') return 'National Historic Landmark';
    if (status === 'NHL_HD') return 'National Historic Landmark District';
    if (status === 'LISTED_INDV') return 'Listed Historic Resource';
    if (status === 'LISTED_HD') return 'Listed Historic District';
    return status || 'Not listed';
  }

  function getHistoricalFeatureStatusLabel(status) {
    if (status === 'C') return 'Contributing';
    if (status === 'KC') return 'Key contributing';
    if (status === 'NC') return 'Non-contributing';
    return status || 'Not listed';
  }

  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T14:10:54-04:00
  // Purpose: Prepares NJDEP historic property site points for marker rendering.
  // Reason: The Historical Sites layer uses official point features, so invalid or partial coordinates should be ignored before drawing.
  const visibleHistoricalSites = useMemo(() => {
    if (!historicalSiteData?.features?.length) return [];
    return historicalSiteData.features
      .map((feature) => ({ feature, position: getPointLatLng(feature) }))
      .filter((item) => item.position);
  }, [historicalSiteData]);

  const treeLegendItems = useMemo(() => {
    if (treeLayerMode === 'forestType') {
      const visibleTypes = new Set(treeLandCoverData?.features?.map((feature) => getLandCoverCategory(feature.properties)));
      return Object.entries(forestTypeDefinitions)
        .filter(([key]) => visibleTypes.has(key))
        .map(([key, definition]) => ({ key, ...definition }));
    }

    if (treeLayerMode === 'dominantSpecies') {
      const visibleSpecies = new Set(treeLandCoverData?.features?.map((feature) => deriveDominantSpecies(feature)));
      return Object.entries(speciesDefinitions)
        .filter(([key]) => visibleSpecies.has(key))
        .map(([key, definition]) => ({ key, ...definition }));
    }

    return Object.entries(abundanceScale).map(([key, definition]) => ({ key, ...definition }));
  }, [treeLandCoverData, treeLayerMode]);

  const treeStyle = (feature) => {
    const properties = feature.properties || {};

    if (treeLayerMode === 'dominantSpecies') {
      const definition = speciesDefinitions[deriveDominantSpecies(feature)] || speciesDefinitions.mixed;
      return {
        color: '#1f2937',
        weight: 0.75,
        opacity: 0.56,
        fillColor: definition.color,
        fillOpacity: 0.5
      };
    }

    if (treeLayerMode === 'abundance') {
      const abundance = getSpeciesAbundance(feature, treeSpecies);
      const definition = abundanceScale[abundance] || abundanceScale.none;
      return {
        color: abundance === 'none' ? '#94a3b8' : '#14532d',
        weight: abundance === 'none' ? 0.45 : 0.8,
        opacity: abundance === 'none' ? 0.26 : 0.58,
        fillColor: definition.color,
        fillOpacity: definition.opacity
      };
    }

    const definition = forestTypeDefinitions[getLandCoverCategory(properties)] || forestTypeDefinitions.barrenOther;
    return {
      color: '#1f2937',
      weight: 0.7,
      opacity: 0.44,
      fillColor: definition.color,
      fillOpacity: 0.44
    };
  };

  const onEachTreeRegion = (feature, layer) => {
    const properties = feature.properties || {};
    const forestType = forestTypeDefinitions[getLandCoverCategory(properties)] || forestTypeDefinitions.barrenOther;
    const dominantKey = deriveDominantSpecies(feature);
    const dominant = speciesDefinitions[dominantKey] || speciesDefinitions.mixed;
    const secondarySpecies = getSecondarySpecies(feature);
    const abundanceKey = getSpeciesAbundance(feature, treeSpecies);
    const abundance = abundanceScale[abundanceKey] || abundanceScale.none;
    const selectedSpecies = speciesDefinitions[treeSpecies] || speciesDefinitions.pitchPine;
    const title =
      treeLayerMode === 'forestType'
        ? forestType.label
        : treeLayerMode === 'dominantSpecies'
          ? dominant.label
          : `${selectedSpecies.label}: ${abundance.label}`;
    const description =
      treeLayerMode === 'forestType'
        ? forestType.description
        : treeLayerMode === 'dominantSpecies'
          ? dominant.description
          : selectedSpecies.description;

    layer.bindTooltip(`${properties.LABEL15 || forestType.label}: ${title}`, { sticky: true });
    layer.bindPopup(`
      <div class="tree-popup">
        <div class="tree-popup__eyebrow">Forest Composition</div>
        <div class="tree-popup__name">${escapeHtml(properties.LABEL15 || forestType.label)}</div>
        <div class="tree-popup__row"><strong>${treeLayerMode === 'abundance' ? 'Selected species' : 'Map value'}:</strong> ${escapeHtml(title)}</div>
        <div class="tree-popup__row"><strong>NJDEP LU/LC class:</strong> ${escapeHtml(properties.TYPE15)} / ${escapeHtml(properties.LABEL15)}</div>
        <div class="tree-popup__row"><strong>Acres:</strong> ${escapeHtml(Number(properties.ACRES || 0).toLocaleString(undefined, { maximumFractionDigits: 0 }))}</div>
        <div class="tree-popup__row"><strong>Interpreted group:</strong> ${escapeHtml(forestType.label)}</div>
        <div class="tree-popup__row"><strong>Dominant estimate:</strong> ${escapeHtml(dominant.label)}</div>
        <div class="tree-popup__row"><strong>Secondary estimates:</strong> ${escapeHtml(formatTreeList(secondarySpecies))}</div>
        <div class="tree-popup__row"><strong>Description:</strong> ${escapeHtml(description)}</div>
        <div class="tree-popup__row"><strong>Data source:</strong> ${escapeHtml(treeLayerMetadata.source)}</div>
        <div class="tree-popup__note">${escapeHtml(treeLayerMetadata.limitation)}</div>
      </div>
    `);
  };

  const countyStyle = (feature) => {
    const countyName = getCountyName(feature);
    const isSelected = selectedCounty === countyName;
    const color = colorByCounty.get(countyName) || '#2563eb';

    return {
      color: activeLayers.highRelief ? '#334155' : isSelected ? '#0f172a' : color,
      weight: activeLayers.highRelief ? (isSelected ? 3 : 1.25) : isSelected ? 4 : 2,
      opacity: activeLayers.highRelief ? 0.52 : 0.95,
      fillColor: color,
      fillOpacity: activeLayers.highRelief ? 0 : isSelected ? 0.36 : 0.2
    };
  };

  const onEachCounty = (feature, layer) => {
    const countyName = getCountyName(feature);
    const seat = getCountySeat(feature);

    layer.bindPopup(`
      <div class="county-popup">
        <div class="county-popup__name">${countyName}</div>
        ${seat ? `<div class="county-popup__meta">County seat: ${seat}</div>` : ''}
      </div>
    `);

    layer.on({
      click: () => setSelectedCounty(countyName),
      mouseover: (event) => {
        event.target.setStyle({
          weight: selectedCounty === countyName ? 4 : 3,
          fillOpacity: selectedCounty === countyName ? 0.42 : 0.3
        });
      },
      mouseout: (event) => {
        if (geoJsonLayerRef.current) {
          geoJsonLayerRef.current.resetStyle(event.target);
        }
      }
    });
  };

  const visibleFeatures = visibleCountyData?.features || [];

  return (
    <div className="map-stage">
      <MapContainer
        center={NJ_CENTER}
        zoom={8}
        minZoom={7}
        maxZoom={15}
        zoomSnap={0.05}
        zoomDelta={0.25}
        zoomControl={false}
        maxBoundsViscosity={0.28}
        className="map-container"
      >
        <TileLayer
          key={baseMap}
          attribution={selectedBaseMap.attribution}
          opacity={activeLayers.highRelief ? 0 : 1}
          url={selectedBaseMap.url}
        />
        {/* AI_CHANGE:
            Tool: Codex
            Model: GPT-5
            Timestamp: 2026-06-08T16:41:05-04:00
            Purpose: Renders a continuous high-relief terrain basemap beneath NJ outlines.
            Reason: Earlier relief treatments were either washed out, bleak, or seam-heavy, so High Relief now uses a warm no-label base with scaled grayscale terrain-normal texture and outline-only county boundaries. */}
        {activeLayers.highRelief && (
          <>
            <TileLayer
              attribution={HIGH_RELIEF_BASE_LAYER.attribution}
              className="high-relief-base-tiles"
              opacity={1}
              url={HIGH_RELIEF_BASE_LAYER.url}
              zIndex={175}
            />
            <TileLayer
              attribution={HIGH_RELIEF_TEXTURE_LAYER.attribution}
              className="high-relief-texture-tiles"
              opacity={0.82}
              tileSize={512}
              url={HIGH_RELIEF_TEXTURE_LAYER.url}
              zoomOffset={-1}
              zIndex={185}
            />
          </>
        )}
        {/* AI_CHANGE:
            Tool: Codex
            Model: GPT-5
            Timestamp: 2026-06-08T13:20:45-04:00
            Purpose: Adds a top-right zoom widget to the map.
            Reason: Users requested visible zoom in/out controls, and top-right placement keeps the widget clear of the default left-side layer panel. */}
        <ZoomControl position="topright" />
        <FitCountyBounds countyData={countyData} isLeftAligned={isLeftAligned} />
        {stateMaskPositions && !activeLayers.highRelief && (
          <Polygon
            positions={stateMaskPositions}
            pathOptions={{
              stroke: false,
              fillColor: '#0f172a',
              fillOpacity: activeLayers.highRelief ? 0.38 : 0.26,
              fillRule: 'evenodd'
            }}
            interactive={false}
          />
        )}
        {activeLayers.counties && visibleCountyData && (
          <>
            <GeoJSON
              key={`${selectedCounty || 'all'}-${hiddenCounties.size}-${searchQuery}`}
              ref={geoJsonLayerRef}
              data={visibleCountyData}
              style={countyStyle}
              onEachFeature={onEachCounty}
            />
            <CountyLabels features={visibleFeatures} />
          </>
        )}
        {activeLayers.canals && visibleCanalData && (
          <GeoJSON
            key={`canals-${canalVisibility.current}-${canalVisibility.historic}`}
            data={visibleCanalData}
            style={canalStyle}
            onEachFeature={onEachCanal}
          />
        )}
        {activeLayers.canals && canalVisibility.historicRail && historicRailData && (
          <GeoJSON
            key={`historic-rail-${historicRailData.features?.length || 0}`}
            data={historicRailData}
            style={historicRailStyle}
            onEachFeature={onEachHistoricRail}
          />
        )}
        {activeLayers.canals && canalVisibility.borderCanals && borderHistoricCanals && (
          <GeoJSON
            key={`border-canals-${borderHistoricCanals.features?.length || 0}`}
            data={borderHistoricCanals}
            style={borderCanalStyle}
            onEachFeature={onEachBorderCanal}
          />
        )}
        {activeLayers.parks && parkData && (
          <GeoJSON key={`parks-${parkData.features?.length || 0}`} data={parkData} style={parkStyle} onEachFeature={onEachPark} />
        )}
        {activeLayers.municipalities && municipalityData && (
          <GeoJSON
            key={`municipalities-${municipalityData.features?.length || 0}`}
            data={municipalityData}
            style={municipalityStyle}
            onEachFeature={onEachMunicipality}
          />
        )}
        {activeLayers.rail && railData && (
          <GeoJSON
            key={`rail-${railData.features?.length || 0}`}
            data={railData}
            style={railStyle}
            onEachFeature={onEachRail}
          />
        )}
        {/* AI_CHANGE:
            Tool: Codex
            Model: GPT-5
            Timestamp: 2026-06-08T14:21:42-04:00
            Purpose: Renders the Forest Composition layer group across forest type, dominant species, and abundance modes.
            Reason: Users requested a polished educational layer that can switch views while clearly labeling the current demo ecology data. */}
        {activeLayers.trees && treeLandCoverData && (
          <GeoJSON
            key={`trees-${treeLayerMode}-${treeSpecies}`}
            data={treeLandCoverData}
            style={treeStyle}
            onEachFeature={onEachTreeRegion}
          />
        )}
        {/* AI_CHANGE:
            Tool: Codex
            Model: GPT-5
            Timestamp: 2026-06-08T14:10:54-04:00
            Purpose: Renders NJDEP listed/NHL historic property site features as map points.
            Reason: Users requested a Historical Sites layer, and the official NJDEP feature dataset exposes these resources as statewide point records. */}
        {activeLayers.historicalSites &&
          visibleHistoricalSites.map(({ feature, position }) => {
            const properties = feature.properties || {};
            const name = properties.FEATNAME || properties.NAME || 'Historical site';
            const address = properties.ADDRESS || 'Not listed';
            const status = getHistoricalStatusLabel(properties.STATUS);
            const featureStatus = getHistoricalFeatureStatusLabel(properties.FEATSTATUS);

            return (
              <CircleMarker
                key={`historical-site-${properties.OBJECTID || `${position[0]}-${position[1]}`}`}
                center={position}
                radius={5}
                pathOptions={{
                  color: '#7f1d1d',
                  weight: 2,
                  opacity: 0.95,
                  fillColor: '#ef4444',
                  fillOpacity: 0.78
                }}
              >
                <Popup>
                  <div className="historical-site-popup">
                    <div className="historical-site-popup__name">{name}</div>
                    <div className="historical-site-popup__row">
                      <strong>Status:</strong> {status}
                    </div>
                    <div className="historical-site-popup__row">
                      <strong>Feature:</strong> {featureStatus}
                    </div>
                    <div className="historical-site-popup__row">
                      <strong>Address:</strong> {address}
                    </div>
                    <div className="historical-site-popup__row">
                      <strong>Source:</strong> NJDEP Historic Property Features
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        {/* AI_CHANGE:
            Tool: Codex
            Model: GPT-5
            Timestamp: 2026-06-08T13:40:16-04:00
            Purpose: Renders attraction destinations as source-linked map points.
            Reason: Users requested an Attractions layer for named destinations such as Wild West City, Waterloo Village, and The Land of Make Believe. */}
        {activeLayers.attractions &&
          attractionLocations.map((location) => (
            <CircleMarker
              key={`attraction-${location.name}`}
              center={location.position}
              radius={6}
              pathOptions={{
                color: '#a16207',
                weight: 2,
                opacity: 0.96,
                fillColor: '#facc15',
                fillOpacity: 0.86
              }}
            >
              <Popup>
                <div className="attraction-popup">
                  <div className="attraction-popup__name">{location.name}</div>
                  <div className="attraction-popup__row">
                    <strong>Type:</strong> {location.category}
                  </div>
                  <div className="attraction-popup__row">
                    <strong>Place:</strong> {location.placeLabel || `${location.town}, ${location.county} County`}
                  </div>
                  <div className="attraction-popup__row">
                    <strong>Note:</strong> {location.note}
                  </div>
                  <a className="attraction-popup__link" href={location.sourceUrl} target="_blank" rel="noreferrer">
                    {location.sourceTitle}
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        {/* AI_CHANGE:
            Tool: Codex
            Model: GPT-5
            Timestamp: 2026-06-08T13:29:19-04:00
            Purpose: Renders public Weird NJ subject locations as a point overlay.
            Reason: Weird NJ entries are named places and legends, so marker points communicate approximate locations better than area fills. */}
        {activeLayers.weirdNj &&
          weirdNjLocations.map((location) => (
            <CircleMarker
              key={`weird-nj-${location.name}`}
              center={location.position}
              radius={6}
              pathOptions={{
                color: '#be123c',
                weight: 2,
                opacity: 0.96,
                fillColor: '#f43f5e',
                fillOpacity: 0.82
              }}
            >
              <Popup>
                <div className="weird-nj-popup">
                  <div className="weird-nj-popup__name">{location.name}</div>
                  <div className="weird-nj-popup__row">
                    <strong>Category:</strong> {location.category}
                  </div>
                  <div className="weird-nj-popup__row">
                    <strong>Place:</strong> {location.town}, {location.county} County
                  </div>
                  <div className="weird-nj-popup__row">
                    <strong>Note:</strong> {location.note}
                  </div>
                  <a className="weird-nj-popup__link" href={location.sourceUrl} target="_blank" rel="noreferrer">
                    {location.sourceTitle}
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>

      {activeLayers.trees && (
        <div className="tree-legend glass-panel" aria-label="Forest Composition legend">
          <div className="tree-legend__heading">
            <span>Forest Composition</span>
            <strong>{treeLayerMode === 'abundance' ? speciesDefinitions[treeSpecies]?.label : treeLayerMode === 'forestType' ? 'Forest Type Map' : 'Dominant Species Map'}</strong>
          </div>
            <div className="tree-legend__status">{treeLayerMetadata.status}</div>
          <div className="tree-legend__items">
            {treeLegendItems.map((item) => (
              <div className="tree-legend__item" key={item.key}>
                <span className="tree-legend__swatch" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI_CHANGE:
          Tool: Codex
          Model: GPT-5
          Timestamp: 2026-06-08T13:24:35-04:00
          Purpose: Shows a floating loading widget while active layers are waiting on data.
          Reason: Layer fetches can take a few seconds, and users need clear feedback that the map is still working. */}
      {loadingLayers.length > 0 && (
        <div className="map-loading-widget" role="status" aria-live="polite">
          <span className="map-loading-widget__spinner" aria-hidden="true" />
          <span>
            Loading {loadingLayers.length === 1 ? loadingLayers[0] : `${loadingLayers.length} layers`}
          </span>
        </div>
      )}
    </div>
  );
}
