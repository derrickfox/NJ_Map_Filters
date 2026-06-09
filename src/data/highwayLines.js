// AI_CHANGE:
// Tool: Codex
// Model: GPT-5
// Timestamp: 2026-06-08T19:03:42-04:00
// Purpose: Adds curated major NJ highway corridors, including Old Mine Road, for the Highways layer.
// Reason: Users requested a map layer for major highways, and Old Mine Road needs explicit inclusion even though it is not a modern expressway.
const highwayLines = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'New Jersey Turnpike',
        route: 'I-95 / NJ Turnpike',
        kind: 'Toll expressway',
        note: 'Approximate mainline corridor from the Delaware Memorial Bridge toward the George Washington Bridge approach.',
        sourceTitle: 'New Jersey Turnpike Authority',
        sourceUrl: 'https://www.njta.com/'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.46, 39.69],
          [-75.35, 39.76],
          [-75.17, 39.85],
          [-74.91, 40.02],
          [-74.73, 40.19],
          [-74.55, 40.34],
          [-74.42, 40.49],
          [-74.28, 40.61],
          [-74.12, 40.72],
          [-74.03, 40.79],
          [-73.99, 40.86]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Garden State Parkway',
        route: 'Garden State Parkway',
        kind: 'Toll parkway',
        note: 'Approximate north-south parkway corridor from Cape May County through the Shore and North Jersey.',
        sourceTitle: 'New Jersey Turnpike Authority',
        sourceUrl: 'https://www.njta.com/'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.91, 38.98],
          [-74.83, 39.15],
          [-74.75, 39.31],
          [-74.65, 39.52],
          [-74.46, 39.72],
          [-74.28, 39.93],
          [-74.18, 40.08],
          [-74.12, 40.21],
          [-74.08, 40.39],
          [-74.12, 40.55],
          [-74.16, 40.72],
          [-74.13, 40.88],
          [-74.08, 41.0]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Interstate 80',
        route: 'I-80',
        kind: 'Interstate',
        note: 'Approximate east-west corridor across North Jersey from the Delaware Water Gap to the George Washington Bridge approach.',
        sourceTitle: 'Federal Highway Administration Interstate System',
        sourceUrl: 'https://www.fhwa.dot.gov/programadmin/interstate.cfm'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.12, 40.97],
          [-74.91, 40.92],
          [-74.71, 40.88],
          [-74.53, 40.86],
          [-74.38, 40.86],
          [-74.22, 40.87],
          [-74.08, 40.87],
          [-73.98, 40.86]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Interstate 78',
        route: 'I-78',
        kind: 'Interstate',
        note: 'Approximate corridor from Phillipsburg/Easton through Newark Bay.',
        sourceTitle: 'Federal Highway Administration Interstate System',
        sourceUrl: 'https://www.fhwa.dot.gov/programadmin/interstate.cfm'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.19, 40.69],
          [-74.99, 40.64],
          [-74.8, 40.64],
          [-74.62, 40.65],
          [-74.45, 40.66],
          [-74.27, 40.69],
          [-74.14, 40.71],
          [-74.07, 40.7]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Interstate 287',
        route: 'I-287',
        kind: 'Interstate',
        note: 'Approximate western North Jersey beltway from Edison north to the New York line.',
        sourceTitle: 'Federal Highway Administration Interstate System',
        sourceUrl: 'https://www.fhwa.dot.gov/programadmin/interstate.cfm'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.34, 40.53],
          [-74.43, 40.57],
          [-74.55, 40.61],
          [-74.64, 40.7],
          [-74.62, 40.82],
          [-74.5, 40.95],
          [-74.33, 41.05],
          [-74.19, 41.12]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Interstate 295',
        route: 'I-295',
        kind: 'Interstate',
        note: 'Approximate Delaware River and central-south Jersey bypass corridor.',
        sourceTitle: 'Federal Highway Administration Interstate System',
        sourceUrl: 'https://www.fhwa.dot.gov/programadmin/interstate.cfm'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.55, 39.69],
          [-75.35, 39.77],
          [-75.13, 39.9],
          [-74.99, 40.03],
          [-74.84, 40.15],
          [-74.74, 40.25],
          [-74.65, 40.34]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Interstate 195',
        route: 'I-195',
        kind: 'Interstate',
        note: 'Approximate cross-state corridor from the Trenton area to Wall Township.',
        sourceTitle: 'Federal Highway Administration Interstate System',
        sourceUrl: 'https://www.fhwa.dot.gov/programadmin/interstate.cfm'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.74, 40.23],
          [-74.58, 40.22],
          [-74.39, 40.19],
          [-74.19, 40.17],
          [-74.06, 40.17]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Atlantic City Expressway',
        route: 'ACE',
        kind: 'Toll expressway',
        note: 'Approximate expressway corridor from Camden County to Atlantic City.',
        sourceTitle: 'South Jersey Transportation Authority',
        sourceUrl: 'https://www.sjta.com/'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.0, 39.82],
          [-74.86, 39.78],
          [-74.69, 39.7],
          [-74.51, 39.61],
          [-74.36, 39.51],
          [-74.43, 39.36]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'U.S. Route 1',
        route: 'US 1',
        kind: 'U.S. highway',
        note: 'Approximate corridor from Trenton through New Brunswick and Newark.',
        sourceTitle: 'Federal Highway Administration U.S. Highway System',
        sourceUrl: 'https://www.fhwa.dot.gov/programadmin/usroute.cfm'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.76, 40.22],
          [-74.66, 40.29],
          [-74.55, 40.36],
          [-74.45, 40.42],
          [-74.36, 40.5],
          [-74.27, 40.57],
          [-74.19, 40.64],
          [-74.1, 40.72]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'U.S. Route 9',
        route: 'US 9',
        kind: 'U.S. highway',
        note: 'Approximate Shore and eastern New Jersey corridor from Cape May north toward Bergen County.',
        sourceTitle: 'Federal Highway Administration U.S. Highway System',
        sourceUrl: 'https://www.fhwa.dot.gov/programadmin/usroute.cfm'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.91, 38.95],
          [-74.81, 39.15],
          [-74.73, 39.32],
          [-74.62, 39.53],
          [-74.37, 39.76],
          [-74.21, 39.96],
          [-74.17, 40.14],
          [-74.14, 40.34],
          [-74.22, 40.52],
          [-74.11, 40.74],
          [-73.99, 40.93]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'New Jersey Route 55',
        route: 'NJ 55',
        kind: 'State freeway',
        note: 'Approximate South Jersey freeway from Gloucester County toward Millville.',
        sourceTitle: 'New Jersey Department of Transportation',
        sourceUrl: 'https://www.nj.gov/transportation/'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.11, 39.82],
          [-75.08, 39.69],
          [-75.04, 39.56],
          [-75.0, 39.43],
          [-74.97, 39.31]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'New Jersey Route 18',
        route: 'NJ 18',
        kind: 'State highway',
        note: 'Approximate central Jersey corridor from Wall through New Brunswick toward Piscataway.',
        sourceTitle: 'New Jersey Department of Transportation',
        sourceUrl: 'https://www.nj.gov/transportation/'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.06, 40.17],
          [-74.13, 40.27],
          [-74.2, 40.36],
          [-74.31, 40.47],
          [-74.43, 40.55]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'U.S. Route 46',
        route: 'US 46',
        kind: 'U.S. highway',
        note: 'Approximate northern New Jersey east-west corridor parallel to I-80.',
        sourceTitle: 'Federal Highway Administration U.S. Highway System',
        sourceUrl: 'https://www.fhwa.dot.gov/programadmin/usroute.cfm'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.12, 40.95],
          [-74.93, 40.91],
          [-74.75, 40.89],
          [-74.57, 40.88],
          [-74.38, 40.89],
          [-74.19, 40.88],
          [-74.02, 40.86]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'New Jersey Route 17',
        route: 'NJ 17',
        kind: 'State highway',
        note: 'Approximate Bergen County north-south highway corridor.',
        sourceTitle: 'New Jersey Department of Transportation',
        sourceUrl: 'https://www.nj.gov/transportation/'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.14, 40.82],
          [-74.1, 40.9],
          [-74.08, 41.0],
          [-74.09, 41.1],
          [-74.12, 41.17]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'New Jersey Route 3',
        route: 'NJ 3',
        kind: 'State highway',
        note: 'Approximate Passaic/Meadowlands corridor into the Lincoln Tunnel approach.',
        sourceTitle: 'New Jersey Department of Transportation',
        sourceUrl: 'https://www.nj.gov/transportation/'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.23, 40.86],
          [-74.16, 40.84],
          [-74.07, 40.8],
          [-74.01, 40.77],
          [-73.99, 40.76]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'New Jersey Route 70',
        route: 'NJ 70',
        kind: 'State highway',
        note: 'Approximate east-west South Jersey corridor from Camden County toward Brick.',
        sourceTitle: 'New Jersey Department of Transportation',
        sourceUrl: 'https://www.nj.gov/transportation/'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.02, 39.93],
          [-74.83, 39.91],
          [-74.64, 39.91],
          [-74.45, 39.93],
          [-74.27, 40.02],
          [-74.14, 40.06]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'U.S. Route 206',
        route: 'US 206',
        kind: 'U.S. highway',
        note: 'Approximate inland north-south corridor from the Pine Barrens through Princeton and Sussex County.',
        sourceTitle: 'Federal Highway Administration U.S. Highway System',
        sourceUrl: 'https://www.fhwa.dot.gov/programadmin/usroute.cfm'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.74, 39.58],
          [-74.75, 39.78],
          [-74.73, 40.0],
          [-74.67, 40.22],
          [-74.66, 40.36],
          [-74.69, 40.55],
          [-74.75, 40.75],
          [-74.78, 40.95],
          [-74.76, 41.15],
          [-74.74, 41.32]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Old Mine Road',
        route: 'Old Mine Road',
        kind: 'Historic/scenic road',
        note: 'Approximate Delaware Water Gap National Recreation Area corridor along the Delaware River.',
        sourceTitle: 'National Park Service: Old Mine Road',
        sourceUrl: 'https://www.nps.gov/dewa/planyourvisit/old-mine-road.htm'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-75.115, 40.976],
          [-75.06, 41.03],
          [-75.035, 41.105],
          [-74.99, 41.18],
          [-74.94, 41.25],
          [-74.895, 41.315],
          [-74.825, 41.37]
        ]
      }
    }
  ]
};

export default highwayLines;
