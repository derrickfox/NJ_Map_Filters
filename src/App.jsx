import React, { useEffect, useMemo, useState } from 'react';
import MapArea from './components/MapArea.jsx';
import LayerControls from './components/LayerControls.jsx';
import attractionLocations from './data/attractionLocations.js';
import beachAreas from './data/beachAreas.js';
import borderHistoricCanals from './data/borderHistoricCanals.js';
import weirdNjLocations from './data/weirdNjLocations.js';

const COUNTY_LAYER_URL =
  'https://maps.nj.gov/arcgis/rest/services/Framework/Government_Boundaries/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=geojson';
const CANALS_LAYER_URL =
  'https://mapsdep.nj.gov/arcgis/rest/services/Features/Hydrography/MapServer/45/query?where=1%3D1&outFields=NAME,TYPE,PURPOSE,STATUS,CONDITION,COUNTY&outSR=4326&f=geojson';
const PARKS_LAYER_URL =
  'https://mapsdep.nj.gov/arcgis/rest/services/Features/Land/MapServer/67/query?where=1%3D1&outFields=OBJECTID,FEATURE_NAME,FEATURE_CLASS,OWNERSHIP,USE_DESIGNATION,LAND_MANAGER_AGENCY,FACILITY_USE,COUNTY,ACRES_TEXT,ACRES&outSR=4326&f=geojson';
const MUNICIPALITIES_LAYER_URL =
  'https://maps.nj.gov/arcgis/rest/services/Framework/Government_Boundaries/MapServer/2/query?where=1%3D1&outFields=OBJECTID,NAME,MUN_LABEL,MUN_TYPE,COUNTY,MUN_CODE,SQ_MILES,POP2020,POPDEN2020&outSR=4326&f=geojson';
const RAIL_LAYER_URL =
  "https://services.arcgis.com/HggmsDF7UJsNN1FK/ArcGIS/rest/services/RAIL_ROAD_NETWORK_NJ/FeatureServer/1/query?where=RR_Status%3D%271%27&outFields=OBJECTID,RR_ID,rr_name,RR_Status,MP_Start,MP_End&outSR=4326&f=geojson";
const HISTORIC_RAIL_LAYER_URL =
  "https://services.arcgis.com/HggmsDF7UJsNN1FK/ArcGIS/rest/services/RAIL_ROAD_NETWORK_NJ/FeatureServer/1/query?where=RR_Status%20IN%20(%272%27%2C%273%27%2C%274%27)&outFields=OBJECTID,RR_ID,rr_name,RR_Status,MP_Start,MP_End&outSR=4326&f=geojson";
const HISTORICAL_SITES_LAYER_URL =
  "https://mapsdep.nj.gov/arcgis/rest/services/Features/Land/MapServer/54/query?where=DEMOLISHED%3C%3E%27YES%27%20AND%20LOC_RESTR%3C%3E%27YES%27%20AND%20STATUS%20IN%20(%27NHL_INDV%27%2C%27NHL_HD%27%2C%27LISTED_INDV%27%2C%27LISTED_HD%27)%20AND%20FEAT_TYPE%3D%27SITE%27&outFields=OBJECTID,FEATNAME,FEATSTATUS,FEAT_TYPE,NAME,ADDRESS,STATUS,LOC_QUAL,NOTES&outSR=4326&f=geojson&resultRecordCount=2000";
const TREE_LAND_COVER_LAYER_URL =
  "https://mapsdep.nj.gov/arcgis/rest/services/Features/Land_lu/MapServer/13/query?where=TYPE15%20IN%20(%27FOREST%27%2C%27WETLANDS%27%2C%27AGRICULTURE%27%2C%27URBAN%27%2C%27WATER%27%2C%27BARREN%20LAND%27)%20AND%20ACRES%20%3E%3D%20500&outFields=OBJECTID,ACRES,LU15,TYPE15,LABEL15&outSR=4326&f=geojson&resultRecordCount=2000&maxAllowableOffset=0.001&geometryPrecision=5";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-shell">
          <h1>The map could not load</h1>
          <p>Something threw an error while rendering. Check the browser console, then try a hard refresh.</p>
          <pre>{String(this.state.error?.message || this.state.error)}</pre>
        </main>
      );
    }

    return this.props.children;
  }
}

function getCountyName(feature) {
  return (
    feature?.properties?.COUNTY ||
    feature?.properties?.COUNTY_NAM ||
    feature?.properties?.COUNTY_LABEL ||
    feature?.properties?.NAME ||
    'Unknown County'
  );
}

function App() {
  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T12:06:08-04:00
  // Purpose: Initializes a New Jersey layer model with counties enabled and canals available as the next overlay.
  // Reason: The NJ sibling app should mirror the DC map filter pattern while starting from county boundaries and growing into NJ-specific layers.
  const [activeLayers, setActiveLayers] = useState({
    counties: true,
    // AI_CHANGE:
    // Tool: Codex
    // Model: GPT-5
    // Timestamp: 2026-06-08T15:01:23-04:00
    // Purpose: Adds a toggleable High Relief terrain overlay to the shared layer state.
    // Reason: Users requested an extreme relief map layer inspired by 3D terrain artwork while keeping counties as the default first layer.
    highRelief: false,
    canals: false,
    parks: false,
    municipalities: false,
    beaches: false,
    weirdNj: false,
    attractions: false,
    rail: false,
    historicalSites: false,
    trees: false
  });
  const [countyData, setCountyData] = useState(null);
  const [countyError, setCountyError] = useState('');
  const [canalData, setCanalData] = useState(null);
  const [canalError, setCanalError] = useState('');
  const [historicRailData, setHistoricRailData] = useState(null);
  const [historicRailError, setHistoricRailError] = useState('');
  const [parkData, setParkData] = useState(null);
  const [parkError, setParkError] = useState('');
  const [municipalityData, setMunicipalityData] = useState(null);
  const [municipalityError, setMunicipalityError] = useState('');
  const [railData, setRailData] = useState(null);
  const [railError, setRailError] = useState('');
  const [historicalSiteData, setHistoricalSiteData] = useState(null);
  const [historicalSiteError, setHistoricalSiteError] = useState('');
  const [treeLandCoverData, setTreeLandCoverData] = useState(null);
  const [treeLandCoverError, setTreeLandCoverError] = useState('');
  const [canalVisibility, setCanalVisibility] = useState({
    current: true,
    historic: true,
    historicRail: true,
    borderCanals: true
  });
  const [hiddenCounties, setHiddenCounties] = useState(new Set());
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLeftAligned, setIsLeftAligned] = useState(true);
  const [layerSuspendSnapshot, setLayerSuspendSnapshot] = useState(null);
  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T12:46:19-04:00
  // Purpose: Defaults the app to a calmer plain basemap while preserving a terrain option.
  // Reason: Detailed terrain tiles can visually overpower overlays such as the Canals layer.
  const [baseMap, setBaseMap] = useState('plain');
  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T14:21:42-04:00
  // Purpose: Tracks the active Forest Composition view and heat-map species.
  // Reason: The tree layer group has multiple educational map modes and needs synchronized controls for switching views.
  const [treeLayerMode, setTreeLayerMode] = useState('forestType');
  const [treeSpecies, setTreeSpecies] = useState('pitchPine');

  useEffect(() => {
    let isMounted = true;

    fetch(COUNTY_LAYER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`County boundary request failed with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setCountyData(data);
        setCountyError('');
      })
      .catch((error) => {
        console.error('Error fetching New Jersey county boundaries:', error);
        if (isMounted) {
          setCountyError(error.message || 'County boundary data could not be loaded.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!activeLayers.canals || canalData || canalError) return;
    let isMounted = true;

    // AI_CHANGE:
    // Tool: Codex
    // Model: GPT-5
    // Timestamp: 2026-06-08T12:15:28-04:00
    // Purpose: Loads NJDEP canal and water-raceway geometry on demand for the Canals & Historic RR layer.
    // Reason: The combined history layer needs current and historic canal features before adding inactive railroad corridors.
    fetch(CANALS_LAYER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Canal layer request failed with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setCanalData(data);
        setCanalError('');
      })
      .catch((error) => {
        console.error('Error fetching New Jersey canal data:', error);
        if (isMounted) {
          setCanalError(error.message || 'Canal data could not be loaded.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeLayers.canals, canalData, canalError]);

  useEffect(() => {
    if (!activeLayers.canals || historicRailData || historicRailError) return;
    let isMounted = true;

    // AI_CHANGE:
    // Tool: Codex
    // Model: GPT-5
    // Timestamp: 2026-06-08T13:57:00-04:00
    // Purpose: Loads inactive, abandoned, and trail-converted railroad lines for the renamed Canals & Historic RR layer.
    // Reason: Users asked to add likely-not-in-service historic train routes alongside the canal overlay.
    fetch(HISTORIC_RAIL_LAYER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Historic rail layer request failed with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setHistoricRailData(data);
        setHistoricRailError('');
      })
      .catch((error) => {
        console.error('Error fetching New Jersey historic rail data:', error);
        if (isMounted) {
          setHistoricRailError(error.message || 'Historic rail data could not be loaded.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeLayers.canals, historicRailData, historicRailError]);

  useEffect(() => {
    if (!activeLayers.parks || parkData || parkError) return;
    let isMounted = true;

    // AI_CHANGE:
    // Tool: Codex
    // Model: GPT-5
    // Timestamp: 2026-06-08T13:11:52-04:00
    // Purpose: Loads generalized NJDEP open-space polygons on demand for the Parks layer.
    // Reason: Users expected park coverage to read as area overlap rather than point markers, and NJDEP Land layer 67 provides lightweight statewide boundaries.
    fetch(PARKS_LAYER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Parks layer request failed with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setParkData(data);
        setParkError('');
      })
      .catch((error) => {
        console.error('Error fetching New Jersey parks data:', error);
        if (isMounted) {
          setParkError(error.message || 'Parks data could not be loaded.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeLayers.parks, parkData, parkError]);

  useEffect(() => {
    if (!activeLayers.municipalities || municipalityData || municipalityError) return;
    let isMounted = true;

    // AI_CHANGE:
    // Tool: Codex
    // Model: GPT-5
    // Timestamp: 2026-06-08T13:17:49-04:00
    // Purpose: Loads NJ municipal boundary polygons on demand for the Towns & Cities layer.
    // Reason: Users requested another area layer, and NJOGIS municipalities provide city, town, borough, township, and village coverage statewide.
    fetch(MUNICIPALITIES_LAYER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Towns & Cities layer request failed with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setMunicipalityData(data);
        setMunicipalityError('');
      })
      .catch((error) => {
        console.error('Error fetching New Jersey municipality data:', error);
        if (isMounted) {
          setMunicipalityError(error.message || 'Towns & Cities data could not be loaded.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeLayers.municipalities, municipalityData, municipalityError]);

  useEffect(() => {
    if (!activeLayers.rail || railData || railError) return;
    let isMounted = true;

    // AI_CHANGE:
    // Tool: Codex
    // Model: GPT-5
    // Timestamp: 2026-06-08T13:49:31-04:00
    // Purpose: Loads active NJ railroad network line geometry on demand for the Rail layer.
    // Reason: Users requested currently operating railways, and NJDOT/NJOGIS exposes an active-only railroad status dataset.
    fetch(RAIL_LAYER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Rail layer request failed with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setRailData(data);
        setRailError('');
      })
      .catch((error) => {
        console.error('Error fetching New Jersey rail data:', error);
        if (isMounted) {
          setRailError(error.message || 'Rail data could not be loaded.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeLayers.rail, railData, railError]);

  useEffect(() => {
    if (!activeLayers.historicalSites || historicalSiteData || historicalSiteError) return;
    let isMounted = true;

    // AI_CHANGE:
    // Tool: Codex
    // Model: GPT-5
    // Timestamp: 2026-06-08T14:10:54-04:00
    // Purpose: Loads a filtered NJDEP historic property site dataset on demand for the Historical Sites layer.
    // Reason: Users requested a Historical Sites layer, and limiting the official dataset to listed/NHL site features keeps the overlay useful and performant.
    fetch(HISTORICAL_SITES_LAYER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Historical Sites layer request failed with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setHistoricalSiteData(data);
        setHistoricalSiteError('');
      })
      .catch((error) => {
        console.error('Error fetching New Jersey historical sites data:', error);
        if (isMounted) {
          setHistoricalSiteError(error.message || 'Historical Sites data could not be loaded.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeLayers.historicalSites, historicalSiteData, historicalSiteError]);

  useEffect(() => {
    if (!activeLayers.trees || treeLandCoverData || treeLandCoverError) return;
    let isMounted = true;

    // AI_CHANGE:
    // Tool: Codex
    // Model: GPT-5
    // Timestamp: 2026-06-08T14:33:26-04:00
    // Purpose: Loads real NJDEP 2015 land-use/land-cover polygons for the Forest Composition layer.
    // Reason: The prior handmade demo polygons were not good enough; the tree layer should be grounded in authoritative statewide land-cover geometry.
    fetch(TREE_LAND_COVER_LAYER_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Forest Composition request failed with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setTreeLandCoverData(data);
        setTreeLandCoverError('');
      })
      .catch((error) => {
        console.error('Error fetching NJDEP tree land-cover data:', error);
        if (isMounted) {
          setTreeLandCoverError(error.message || 'Forest Composition data could not be loaded.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeLayers.trees, treeLandCoverData, treeLandCoverError]);

  const countyList = useMemo(() => {
    const names = new Set();
    countyData?.features?.forEach((feature) => names.add(getCountyName(feature)));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [countyData]);

  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T13:24:35-04:00
  // Purpose: Tracks active map layers that are still waiting on remote data.
  // Reason: Users need a visible loading widget while newly enabled layers are still fetching and rendering.
  const loadingLayers = useMemo(() => {
    const layers = [];
    if (activeLayers.counties && !countyData && !countyError) layers.push('Counties');
    if (
      activeLayers.canals &&
      ((!canalData && !canalError) || (!historicRailData && !historicRailError))
    ) {
      layers.push('Canals & Historic RR');
    }
    if (activeLayers.parks && !parkData && !parkError) layers.push('Parks');
    if (activeLayers.municipalities && !municipalityData && !municipalityError) layers.push('Towns & Cities');
    if (activeLayers.rail && !railData && !railError) layers.push('Rail');
    if (activeLayers.historicalSites && !historicalSiteData && !historicalSiteError) layers.push('Historical Sites');
    if (activeLayers.trees && !treeLandCoverData && !treeLandCoverError) layers.push('Forest Composition');
    return layers;
  }, [
    activeLayers,
    canalData,
    canalError,
    countyData,
    countyError,
    historicRailData,
    historicRailError,
    historicalSiteData,
    historicalSiteError,
    municipalityData,
    municipalityError,
    parkData,
    parkError,
    railData,
    railError,
    treeLandCoverData,
    treeLandCoverError
  ]);

  const toggleLayer = (layerId) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const toggleSuspendAllLayers = () => {
    if (layerSuspendSnapshot) {
      setActiveLayers(layerSuspendSnapshot);
      setLayerSuspendSnapshot(null);
      return;
    }

    setLayerSuspendSnapshot({ ...activeLayers });
    setActiveLayers((prev) => {
      const next = {};
      Object.keys(prev).forEach((key) => {
        next[key] = false;
      });
      return next;
    });
  };

  const toggleCountyVisibility = (name) => {
    setHiddenCounties((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const toggleAllCountiesVisibility = () => {
    if (hiddenCounties.size === countyList.length && countyList.length > 0) {
      setHiddenCounties(new Set());
    } else {
      setHiddenCounties(new Set(countyList));
    }
  };

  const toggleCanalVisibility = (group) => {
    setCanalVisibility((prev) => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return (
    <div className="app-shell">
      <MapArea
        activeLayers={activeLayers}
        countyData={countyData}
        canalData={canalData}
        canalVisibility={canalVisibility}
        historicRailData={historicRailData}
        borderHistoricCanals={borderHistoricCanals}
        parkData={parkData}
        municipalityData={municipalityData}
        railData={railData}
        historicalSiteData={historicalSiteData}
        treeLandCoverData={treeLandCoverData}
        treeLayerMode={treeLayerMode}
        treeSpecies={treeSpecies}
        attractionLocations={attractionLocations}
        beachAreas={beachAreas}
        weirdNjLocations={weirdNjLocations}
        hiddenCounties={hiddenCounties}
        selectedCounty={selectedCounty}
        setSelectedCounty={setSelectedCounty}
        searchQuery={searchQuery}
        isLeftAligned={isLeftAligned}
        baseMap={baseMap}
        loadingLayers={loadingLayers}
      />
      <LayerControls
        activeLayers={activeLayers}
        toggleLayer={toggleLayer}
        layersSuspended={layerSuspendSnapshot !== null}
        onToggleSuspendAllLayers={toggleSuspendAllLayers}
        countyList={countyList}
        hiddenCounties={hiddenCounties}
        toggleCountyVisibility={toggleCountyVisibility}
        toggleAllCountiesVisibility={toggleAllCountiesVisibility}
        selectedCounty={selectedCounty}
        setSelectedCounty={setSelectedCounty}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLeftAligned={isLeftAligned}
        setIsLeftAligned={setIsLeftAligned}
        countyError={countyError}
        canalError={canalError}
        canalData={canalData}
        historicRailData={historicRailData}
        historicRailError={historicRailError}
        borderHistoricCanals={borderHistoricCanals}
        canalVisibility={canalVisibility}
        toggleCanalVisibility={toggleCanalVisibility}
        parkData={parkData}
        parkError={parkError}
        municipalityData={municipalityData}
        municipalityError={municipalityError}
        railData={railData}
        railError={railError}
        historicalSiteData={historicalSiteData}
        historicalSiteError={historicalSiteError}
        treeLandCoverData={treeLandCoverData}
        treeLandCoverError={treeLandCoverError}
        treeLayerMode={treeLayerMode}
        setTreeLayerMode={setTreeLayerMode}
        treeSpecies={treeSpecies}
        setTreeSpecies={setTreeSpecies}
        attractionLocations={attractionLocations}
        beachAreas={beachAreas}
        weirdNjLocations={weirdNjLocations}
        baseMap={baseMap}
        setBaseMap={setBaseMap}
      />
    </div>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}
