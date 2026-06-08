// AI_CHANGE:
// Tool: Codex
// Model: GPT-5
// Timestamp: 2026-06-08T13:57:00-04:00
// Purpose: Adds approximate non-NJ historic canal corridors that border or terminate near New Jersey.
// Reason: Users requested canals such as the D&H Canal near Port Jervis and Pennsylvania canals near Easton even when they are not attributed to NJDEP.
const borderHistoricCanals = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        NAME: 'Delaware & Hudson Canal - Delaware/Port Jervis Section',
        STATUS: 'Historic border canal',
        LOCATION: 'Port Jervis, NY to Lackawaxen, PA corridor',
        NOTE: 'Approximate corridor near the NJ/NY/PA border; not an NJDEP-attributed canal feature.',
        SOURCE_TITLE: 'Delaware and Hudson Canal history',
        SOURCE_URL: 'https://en.wikipedia.org/wiki/Delaware_and_Hudson_Canal'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.6945, 41.374],
          [-74.737, 41.396],
          [-74.788, 41.414],
          [-74.844, 41.439],
          [-74.9, 41.477],
          [-74.986, 41.484],
          [-75.05, 41.482],
          [-75.093, 41.481]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: 'Delaware Canal - Easton to Riegelsville Section',
        STATUS: 'Historic border canal',
        LOCATION: 'Pennsylvania side of the Delaware River opposite NJ',
        NOTE: 'Approximate Delaware Canal corridor along the Pennsylvania bank near the NJ border.',
        SOURCE_TITLE: 'Pennsylvania DCNR Delaware Canal maps',
        SOURCE_URL: 'https://www.pa.gov/agencies/dcnr/recreation/where-to-go/state-parks/find-a-park/delaware-canal-state-park/maps.html'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.205, 40.691],
          [-75.203, 40.667],
          [-75.197, 40.638],
          [-75.193, 40.612],
          [-75.186, 40.586],
          [-75.18, 40.565]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        NAME: 'Lehigh Canal - Easton/Bethlehem Section',
        STATUS: 'Historic canal terminus near NJ',
        LOCATION: 'Lehigh River corridor into Easton, PA',
        NOTE: 'Approximate Lehigh Canal approach to Easton, where it connected with Delaware/Morris canal traffic.',
        SOURCE_TITLE: 'Lehigh Canal overview',
        SOURCE_URL: 'https://en.wikipedia.org/wiki/Lehigh_Canal'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.205, 40.691],
          [-75.22, 40.684],
          [-75.241, 40.675],
          [-75.265, 40.662],
          [-75.292, 40.65],
          [-75.318, 40.635],
          [-75.342, 40.621],
          [-75.37, 40.611]
        ]
      }
    }
  ]
};

export default borderHistoricCanals;
