import React, { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Building2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FerrisWheel,
  Ghost,
  Landmark,
  Layers,
  Map,
  Mountain,
  Route,
  Search,
  TreePine,
  Train,
  Umbrella,
  Waves,
  X
} from 'lucide-react';
import {
  abundanceSpeciesOptions,
  speciesDefinitions,
  treeLayerModes
} from '../data/treeCompositionRules.js';

function getCanalGroup(feature) {
  return feature?.properties?.STATUS === 'Active' ? 'current' : 'historic';
}

export default function LayerControls({
  activeLayers,
  toggleLayer,
  layersSuspended = false,
  onToggleSuspendAllLayers,
  countyList = [],
  hiddenCounties = new Set(),
  toggleCountyVisibility,
  toggleAllCountiesVisibility,
  selectedCounty,
  setSelectedCounty,
  searchQuery,
  setSearchQuery,
  isLeftAligned,
  setIsLeftAligned,
  countyError,
  canalError,
  canalData,
  historicRailData,
  historicRailError,
  borderHistoricCanals,
  canalVisibility = { current: true, historic: true, historicRail: true, borderCanals: true },
  toggleCanalVisibility,
  parkData,
  parkError,
  municipalityData,
  municipalityError,
  railData,
  railError,
  historicalSiteData,
  historicalSiteError,
  treeLandCoverData,
  treeLandCoverError,
  treeLayerMode,
  setTreeLayerMode,
  treeSpecies,
  setTreeSpecies,
  attractionLocations = [],
  beachAreas,
  highwayLines,
  weirdNjLocations = [],
  baseMap = 'plain',
  setBaseMap
}) {
  // AI_CHANGE:
  // Tool: Codex
  // Model: GPT-5
  // Timestamp: 2026-06-08T13:40:16-04:00
  // Purpose: Collapses detailed filter sections by default.
  // Reason: Users asked for the filters to start collapsed so the layer list is easier to scan.
  const [isCountiesExpanded, setIsCountiesExpanded] = useState(false);
  const [isCanalsExpanded, setIsCanalsExpanded] = useState(false);
  const [isTreesExpanded, setIsTreesExpanded] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const visibleCountiesCount = useMemo(
    () => Math.max(0, countyList.length - hiddenCounties.size),
    [countyList.length, hiddenCounties.size]
  );
  const canalCounts = useMemo(() => {
    const counts = { current: 0, historic: 0, historicRail: 0, borderCanals: 0, visible: 0, total: 0 };
    canalData?.features?.forEach((feature) => {
      const group = getCanalGroup(feature);
      counts[group] += 1;
      counts.total += 1;
      if (canalVisibility[group]) counts.visible += 1;
    });
    counts.historicRail = historicRailData?.features?.length || 0;
    counts.total += counts.historicRail;
    if (canalVisibility.historicRail) counts.visible += counts.historicRail;
    counts.borderCanals = borderHistoricCanals?.features?.length || 0;
    counts.total += counts.borderCanals;
    if (canalVisibility.borderCanals) counts.visible += counts.borderCanals;
    return counts;
  }, [borderHistoricCanals, canalData, canalVisibility, historicRailData]);
  const parkCount = parkData?.features?.length || 0;
  const municipalityCount = municipalityData?.features?.length || 0;
  const railCount = railData?.features?.length || 0;
  const historicalSiteCount = historicalSiteData?.features?.length || 0;
  const treeRegionCount = treeLandCoverData?.features?.length || 0;
  const attractionCount = attractionLocations.length;
  const beachCount = beachAreas?.features?.length || 0;
  const highwayCount = highwayLines?.features?.length || 0;
  const weirdNjCount = weirdNjLocations.length;

  return (
    <aside
      className="glass-panel layer-panel"
      style={{
        right: isLeftAligned ? 'auto' : '24px',
        left: isLeftAligned ? '24px' : 'auto'
      }}
    >
      {/* AI_CHANGE:
          Tool: Codex
          Model: GPT-5
          Timestamp: 2026-06-08T12:06:08-04:00
          Purpose: Provides county-focused controls for the New Jersey map layer.
          Reason: The NJ app needs the same toggle/filter workflow as the DC app, but with counties as the first geographic layer. */}
      <div className="panel-heading">
        <h2>
          <Layers size={24} className="text-gradient" />
          <span className="text-gradient">NJ Layer Lab</span>
        </h2>
        <div className="panel-toolbar">
          <button
            type="button"
            className={`icon-button ${layersSuspended ? 'is-active' : ''}`}
            onClick={onToggleSuspendAllLayers}
            title={layersSuspended ? 'Restore layers' : 'Hide all layers'}
          >
            {layersSuspended ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => setIsPanelCollapsed((value) => !value)}
            title={isPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {isPanelCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => setIsLeftAligned((value) => !value)}
            title={`Move panel to ${isLeftAligned ? 'right' : 'left'}`}
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>
      </div>

      {!isPanelCollapsed && (
        <>
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search counties..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} title="Clear search">
                <X size={16} />
              </button>
            )}
          </div>

          {countyError && <div className="status-message status-message--error">{countyError}</div>}

          {/* AI_CHANGE:
              Tool: Codex
              Model: GPT-5
              Timestamp: 2026-06-08T12:46:19-04:00
              Purpose: Adds a basemap mode switch for plain versus terrain map tiles.
              Reason: Users need a quieter map option so selected overlays, especially canals, remain legible. */}
          <section className="basemap-control" aria-label="Basemap style">
            <span className="basemap-control__label">Basemap</span>
            <div className="basemap-segment">
              <button
                type="button"
                className={baseMap === 'plain' ? 'is-selected' : ''}
                onClick={() => setBaseMap('plain')}
              >
                Plain
              </button>
              <button
                type="button"
                className={baseMap === 'terrain' ? 'is-selected' : ''}
                onClick={() => setBaseMap('terrain')}
              >
                Terrain
              </button>
            </div>
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T15:01:23-04:00
                Purpose: Adds a High Relief terrain overlay control near the basemap chooser.
                Reason: Users requested an extreme shaded terrain layer that can be toggled independently from the plain and terrain basemaps. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.highRelief ? 'active-relief' : ''}`}
              onClick={() => toggleLayer('highRelief')}
            >
              <span>
                <Mountain size={18} color={activeLayers.highRelief ? '#ffffff' : '#854d0e'} />
                High Relief
              </span>
              {activeLayers.highRelief ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <p className="layer-summary">High-contrast shaded relief terrain</p>
          </section>

          <section className="layer-group">
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.counties ? 'active-orange' : ''}`}
              onClick={() => toggleLayer('counties')}
            >
              <span>
                <Map size={18} color={activeLayers.counties ? '#ffffff' : '#f97316'} />
                Counties
              </span>
              <span className="layer-toggle__actions">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleAllCountiesVisibility();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleAllCountiesVisibility();
                    }
                  }}
                  title={
                    hiddenCounties.size === countyList.length && countyList.length > 0
                      ? 'Show all counties'
                      : 'Hide all counties'
                  }
                >
                  {hiddenCounties.size === countyList.length && countyList.length > 0 ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsCountiesExpanded((value) => !value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      setIsCountiesExpanded((value) => !value);
                    }
                  }}
                  title="Expand counties"
                >
                  {isCountiesExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </span>
            </button>

            <div className="layer-summary">
              {countyList.length ? `${visibleCountiesCount} of ${countyList.length} counties visible` : 'Loading counties...'}
            </div>

            {selectedCounty && (
              <button type="button" className="selected-chip" onClick={() => setSelectedCounty(null)}>
                {selectedCounty}
                <X size={14} />
              </button>
            )}

            {isCountiesExpanded && (
              <div className="county-list">
                {countyList.length === 0 ? (
                  <div className="status-message">Loading county boundaries...</div>
                ) : (
                  countyList.map((name) => {
                    const isHidden = hiddenCounties.has(name);
                    const isSelected = selectedCounty === name;

                    return (
                      <div key={name} className={`county-row ${isSelected ? 'is-selected' : ''}`}>
                        <button type="button" className="county-name" onClick={() => setSelectedCounty(name)}>
                          {name}
                        </button>
                        <button
                          type="button"
                          className="county-visibility"
                          onClick={() => toggleCountyVisibility(name)}
                          title={isHidden ? `Show ${name}` : `Hide ${name}`}
                        >
                          {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T18:46:24-04:00
                Purpose: Reorders the Towns & Cities control directly after Counties.
                Reason: Municipal boundaries are the next most logical administrative layer after county boundaries. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.municipalities ? 'active-purple' : ''}`}
              onClick={() => toggleLayer('municipalities')}
            >
              <span>
                <Building2 size={18} color={activeLayers.municipalities ? '#ffffff' : '#7c3aed'} />
                Towns & Cities
              </span>
            </button>

            <div className="layer-summary">
              {activeLayers.municipalities
                ? municipalityData
                  ? `${municipalityCount} municipal areas visible`
                  : 'Loading municipal areas...'
                : 'NJ municipal boundary areas'}
            </div>

            {municipalityError && <div className="status-message status-message--error">{municipalityError}</div>}
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T14:21:42-04:00
                Purpose: Adds controls for the Forest Composition layer group.
                Reason: Users requested switchable forest type, dominant species, and species abundance views with a species picker. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.trees ? 'active-forest' : ''}`}
              onClick={() => toggleLayer('trees')}
            >
              <span>
                <TreePine size={18} color={activeLayers.trees ? '#ffffff' : '#166534'} />
                Forest Composition
              </span>
              <span className="layer-toggle__actions">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsTreesExpanded((value) => !value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      setIsTreesExpanded((value) => !value);
                    }
                  }}
                  title="Expand Forest Composition"
                >
                  {isTreesExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </span>
            </button>

            <div className="layer-summary">
              {activeLayers.trees
                ? treeLandCoverData
                  ? `${treeRegionCount} NJDEP land-cover patches visible`
                  : 'Loading NJDEP land-cover patches...'
                : 'Real LU/LC shapes with species estimates'}
            </div>

            {treeLandCoverError && <div className="status-message status-message--error">{treeLandCoverError}</div>}

            {isTreesExpanded && (
              <div className="tree-controls">
                <div className="tree-mode-grid" aria-label="Tree composition view">
                  {treeLayerModes.map((mode) => (
                    <button
                      type="button"
                      key={mode.id}
                      className={treeLayerMode === mode.id ? 'is-selected' : ''}
                      onClick={() => setTreeLayerMode(mode.id)}
                    >
                      {mode.label.replace(' Map', '')}
                    </button>
                  ))}
                </div>

                {treeLayerMode === 'abundance' && (
                  <label className="tree-field">
                    <span>Species / group</span>
                    <select value={treeSpecies} onChange={(event) => setTreeSpecies(event.target.value)}>
                      {abundanceSpeciesOptions.map((speciesKey) => (
                        <option key={speciesKey} value={speciesKey}>
                          {speciesDefinitions[speciesKey].label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            )}
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T18:46:24-04:00
                Purpose: Places Parks in the natural area portion of the layer list.
                Reason: Public open-space polygons fit best after forest composition and before shoreline recreation overlays. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.parks ? 'active-green' : ''}`}
              onClick={() => toggleLayer('parks')}
            >
              <span>
                <TreePine size={18} color={activeLayers.parks ? '#ffffff' : '#16a34a'} />
                Parks
              </span>
            </button>

            <div className="layer-summary">
              {activeLayers.parks
                ? parkData
                  ? `${parkCount} park and open-space areas visible`
                  : 'Loading park areas...'
                : 'NJDEP park and open-space areas'}
            </div>

            {parkError && <div className="status-message status-message--error">{parkError}</div>}
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T18:46:24-04:00
                Purpose: Places Beaches near other outdoor area overlays in the layer list.
                Reason: Swimmable shoreline zones are more logically grouped with parks and natural-use areas than with terrain controls. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.beaches ? 'active-beach' : ''}`}
              onClick={() => toggleLayer('beaches')}
            >
              <span>
                <Umbrella size={18} color={activeLayers.beaches ? '#ffffff' : '#0e7490'} />
                Beaches
              </span>
            </button>

            <div className="layer-summary">
              {activeLayers.beaches
                ? `${beachCount} swimming beach areas visible`
                : 'Swimmable public beach shoreline zones'}
            </div>
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T19:03:42-04:00
                Purpose: Adds a Highways layer toggle in the transportation section.
                Reason: Users requested major highway corridors, including Old Mine Road, as a dedicated layer. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.highways ? 'active-highway' : ''}`}
              onClick={() => toggleLayer('highways')}
            >
              <span>
                <Route size={18} color={activeLayers.highways ? '#ffffff' : '#c2410c'} />
                Highways
              </span>
            </button>

            <div className="layer-summary">
              {activeLayers.highways
                ? `${highwayCount} major highway corridors visible`
                : 'Major roads and Old Mine Road'}
            </div>
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T13:49:31-04:00
                Purpose: Adds a Rail layer toggle for active railroad network lines.
                Reason: Users requested a layer showing currently operating railways across New Jersey. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.rail ? 'active-ink' : ''}`}
              onClick={() => toggleLayer('rail')}
            >
              <span>
                <Train size={18} color={activeLayers.rail ? '#ffffff' : '#111827'} />
                Rail
              </span>
            </button>

            <div className="layer-summary">
              {activeLayers.rail
                ? railData
                  ? `${railCount} active rail segments visible`
                  : 'Loading active railways...'
                : 'Currently operating railways'}
            </div>

            {railError && <div className="status-message status-message--error">{railError}</div>}
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T12:15:28-04:00
                Purpose: Adds controls for the renamed Canals & Historic RR layer with canal, inactive rail, and border-canal sub-filters.
                Reason: Users need to toggle active canals, historic canal remnants, likely-not-in-service rail corridors, and non-NJ border canals from one history-focused layer. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.canals ? 'active-blue' : ''}`}
              onClick={() => toggleLayer('canals')}
            >
              <span>
                <Waves size={18} color={activeLayers.canals ? '#ffffff' : '#0284c7'} />
                Canals & Historic RR
              </span>
              <span className="layer-toggle__actions">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsCanalsExpanded((value) => !value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      setIsCanalsExpanded((value) => !value);
                    }
                  }}
                  title="Expand Canals & Historic RR"
                >
                  {isCanalsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </span>
            </button>

            <div className="layer-summary">
              {activeLayers.canals
                ? canalData && historicRailData
                  ? `${canalCounts.visible} of ${canalCounts.total} canal and historic rail features visible`
                  : 'Loading canals and historic rail...'
                : 'Current canals, historic canals, and inactive rail corridors'}
            </div>

            {canalError && <div className="status-message status-message--error">{canalError}</div>}
            {historicRailError && <div className="status-message status-message--error">{historicRailError}</div>}

            {isCanalsExpanded && (
              <div className="canal-filter-list">
                <button
                  type="button"
                  className={`canal-filter-row ${canalVisibility.current ? '' : 'is-muted'}`}
                  onClick={() => toggleCanalVisibility('current')}
                >
                  <span className="canal-swatch canal-swatch--current" />
                  <span className="canal-filter-label">
                    <strong>Current</strong>
                    <span>{canalData ? `${canalCounts.current} active features` : 'Active waterways'}</span>
                  </span>
                  {canalVisibility.current ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  type="button"
                  className={`canal-filter-row ${canalVisibility.historic ? '' : 'is-muted'}`}
                  onClick={() => toggleCanalVisibility('historic')}
                >
                  <span className="canal-swatch canal-swatch--historic" />
                  <span className="canal-filter-label">
                    <strong>Historic</strong>
                    <span>{canalData ? `${canalCounts.historic} inactive features` : 'Inactive remnants and raceways'}</span>
                  </span>
                  {canalVisibility.historic ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  type="button"
                  className={`canal-filter-row ${canalVisibility.historicRail ? '' : 'is-muted'}`}
                  onClick={() => toggleCanalVisibility('historicRail')}
                >
                  <span className="canal-swatch canal-swatch--historic-rail" />
                  <span className="canal-filter-label">
                    <strong>Historic RR</strong>
                    <span>
                      {historicRailData
                        ? `${canalCounts.historicRail} inactive rail corridors`
                        : 'Abandoned, out-of-service, and trail-converted rail'}
                    </span>
                  </span>
                  {canalVisibility.historicRail ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  type="button"
                  className={`canal-filter-row ${canalVisibility.borderCanals ? '' : 'is-muted'}`}
                  onClick={() => toggleCanalVisibility('borderCanals')}
                >
                  <span className="canal-swatch canal-swatch--border-canal" />
                  <span className="canal-filter-label">
                    <strong>Border Canals</strong>
                    <span>{`${canalCounts.borderCanals} non-NJ canal corridors near the border`}</span>
                  </span>
                  {canalVisibility.borderCanals ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
            )}
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T18:46:24-04:00
                Purpose: Moves Historical Sites after corridor/history infrastructure layers.
                Reason: The layer list now flows from boundaries and landscape layers into transportation/water corridors and then historic destinations. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.historicalSites ? 'active-red' : ''}`}
              onClick={() => toggleLayer('historicalSites')}
            >
              <span>
                <Landmark size={18} color={activeLayers.historicalSites ? '#ffffff' : '#b91c1c'} />
                Historical Sites
              </span>
            </button>

            <div className="layer-summary">
              {activeLayers.historicalSites
                ? historicalSiteData
                  ? `${historicalSiteCount} listed historical sites visible`
                  : 'Loading historical sites...'
                : 'Listed and landmark historic sites'}
            </div>

            {historicalSiteError && <div className="status-message status-message--error">{historicalSiteError}</div>}
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T18:46:24-04:00
                Purpose: Moves Attractions into the destination portion of the layer list.
                Reason: Attractions are point-of-interest style content and read best after historic-site overlays. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.attractions ? 'active-yellow' : ''}`}
              onClick={() => toggleLayer('attractions')}
            >
              <span>
                <FerrisWheel size={18} color={activeLayers.attractions ? '#ffffff' : '#a16207'} />
                Attractions
              </span>
            </button>

            <div className="layer-summary">
              {activeLayers.attractions
                ? `${attractionCount} attractions visible`
                : 'Classic NJ and regional attractions'}
            </div>
          </section>

          <section className="layer-group">
            {/* AI_CHANGE:
                Tool: Codex
                Model: GPT-5
                Timestamp: 2026-06-08T13:29:19-04:00
                Purpose: Adds a Weird NJ layer toggle for public legend and oddity locations.
                Reason: Users requested a Weird NJ layer gathered from the publication universe, represented here through public source references and approximate points. */}
            <button
              type="button"
              className={`glass-button layer-toggle ${activeLayers.weirdNj ? 'active-rose' : ''}`}
              onClick={() => toggleLayer('weirdNj')}
            >
              <span>
                <Ghost size={18} color={activeLayers.weirdNj ? '#ffffff' : '#be123c'} />
                Weird NJ
              </span>
            </button>

            <div className="layer-summary">
              {activeLayers.weirdNj
                ? `${weirdNjCount} public Weird NJ subjects visible`
                : 'Public Weird NJ legends and oddities'}
            </div>
          </section>
        </>
      )}
    </aside>
  );
}
