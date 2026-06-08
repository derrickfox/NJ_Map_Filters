<!--
AI_CHANGE:
Tool: Codex
Model: GPT-5
Timestamp: 2026-06-08T14:21:42-04:00
Purpose: Documents the Forest Composition layer group and its current real-data / estimated-species status.
Reason: Users requested clear documentation about what the layer does, what data is being used, and where interpretation limits remain.
-->

# NJ Layer Lab

## Forest Composition

The **Forest Composition** layer group adds three educational views for exploring broad tree and forest patterns across New Jersey:

- **Forest Type Map** shows broad forest and land-cover categories such as oak-hickory forest, Pine Barrens, cedar swamp, wetland forest, urban tree cover, agriculture/open land, and water/non-forest context.
- **Dominant Species Map** shows the estimated dominant tree species or species group for each demo region.
- **Species Abundance Heat Map** lets the user choose one species or species group and see estimated relative abundance from no data/not observed through very high abundance.

The current implementation fetches real NJDEP **Land Use/Land Cover 2015** polygons from `Features/Land_lu` MapServer layer 13. To keep the browser performant, the app loads major statewide patches of 500 acres or larger and simplifies the geometry requested from the service.

The forest and land-cover shapes are real. The **Dominant Species Map** and **Species Abundance Heat Map** are still interpreted estimates derived from LU/LC class and broad New Jersey ecological patterns. They are not species survey products.

Good future replacement or enhancement sources include USDA Forest Service FIA data, USGS/NLCD products, NJDEP forest-type products if available, or carefully processed GBIF/iNaturalist observations. A future species dataset can replace the current derivation rules in `src/data/treeCompositionRules.js`.

Known limitations:

- The app intentionally shows only large LU/LC patches, not every mapped polygon.
- Abundance is relative and estimated, not measured.
- Species are grouped where species-level certainty would be misleading.
- Species estimates are based on land-cover class and coarse geography, not plot-level field data.
- Observation coverage is not represented.
