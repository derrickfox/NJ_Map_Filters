// AI_CHANGE:
// Tool: Codex
// Model: GPT-5
// Timestamp: 2026-06-08T18:19:34-04:00
// Purpose: Adds curated swimmable beach shoreline polygons for the Beaches area layer.
// Reason: Users requested an area layer that highlights parts of the New Jersey coastline where people can actually swim.
function beachFeature(name, county, municipalities, polygon, sourceTitle, sourceUrl, note) {
  return {
    type: 'Feature',
    properties: {
      name,
      county,
      municipalities,
      sourceTitle,
      sourceUrl,
      note
    },
    geometry: {
      type: 'Polygon',
      coordinates: [polygon]
    }
  };
}

const beachAreas = {
  type: 'FeatureCollection',
  features: [
    beachFeature(
      'Sandy Hook Beaches',
      'Monmouth',
      'Middletown',
      [
        [-74.005, 40.476],
        [-73.985, 40.476],
        [-73.981, 40.422],
        [-74.010, 40.420],
        [-74.005, 40.476]
      ],
      'Gateway National Recreation Area - Sandy Hook',
      'https://www.nps.gov/gate/planyourvisit/sandy-hook.htm',
      'Ocean and bay beach areas in Sandy Hook, managed by the National Park Service.'
    ),
    beachFeature(
      'Northern Monmouth Shore Beaches',
      'Monmouth',
      'Sea Bright, Monmouth Beach, Long Branch',
      [
        [-73.991, 40.409],
        [-73.964, 40.407],
        [-73.975, 40.278],
        [-74.004, 40.280],
        [-73.991, 40.409]
      ],
      'Monmouth County Public Beaches',
      'https://visitmonmouth.com/Page.aspx?Id=2498',
      'Public ocean beaches along the northern Monmouth County shore.'
    ),
    beachFeature(
      'Asbury Park to Manasquan Beaches',
      'Monmouth',
      'Asbury Park, Ocean Grove, Bradley Beach, Belmar, Spring Lake, Sea Girt, Manasquan',
      [
        [-73.998, 40.232],
        [-73.970, 40.231],
        [-74.025, 40.105],
        [-74.055, 40.109],
        [-73.998, 40.232]
      ],
      'Visit Monmouth Beaches',
      'https://visitmonmouth.com/Page.aspx?Id=2498',
      'Continuous public swimming beach communities from Asbury Park south to Manasquan.'
    ),
    beachFeature(
      'Point Pleasant Beach',
      'Ocean',
      'Point Pleasant Beach',
      [
        [-74.038, 40.102],
        [-74.023, 40.101],
        [-74.043, 40.075],
        [-74.061, 40.078],
        [-74.038, 40.102]
      ],
      'Point Pleasant Beach',
      'https://www.pointpleasantbeach.org/',
      'Public ocean beach and boardwalk swimming area.'
    ),
    beachFeature(
      'Seaside and Island Beach Beaches',
      'Ocean',
      'Seaside Heights, Seaside Park, Berkeley Township',
      [
        [-74.071, 39.962],
        [-74.050, 39.958],
        [-74.070, 39.780],
        [-74.103, 39.790],
        [-74.071, 39.962]
      ],
      'Island Beach State Park',
      'https://dep.nj.gov/parksandforests/state-park/island-beach-state-park/',
      'Seaside beaches and the guarded swimming beach at Island Beach State Park.'
    ),
    beachFeature(
      'Long Beach Island Beaches',
      'Ocean',
      'Barnegat Light to Beach Haven',
      [
        [-74.123, 39.761],
        [-74.100, 39.760],
        [-74.235, 39.529],
        [-74.270, 39.540],
        [-74.123, 39.761]
      ],
      'Long Beach Island Chamber',
      'https://welcometolbi.com/',
      'Oceanfront swimming beaches along Long Beach Island communities.'
    ),
    beachFeature(
      'Brigantine Beach',
      'Atlantic',
      'Brigantine',
      [
        [-74.353, 39.430],
        [-74.327, 39.429],
        [-74.353, 39.370],
        [-74.387, 39.377],
        [-74.353, 39.430]
      ],
      'City of Brigantine Beach Tags',
      'https://brigantinebeach.org/',
      'Public Atlantic Ocean beach area on Brigantine Island.'
    ),
    beachFeature(
      'Absecon Island Beaches',
      'Atlantic',
      'Atlantic City, Ventnor, Margate, Longport',
      [
        [-74.405, 39.364],
        [-74.383, 39.358],
        [-74.542, 39.306],
        [-74.566, 39.316],
        [-74.405, 39.364]
      ],
      'Atlantic City Beach',
      'https://www.atlanticcitynj.com/explore/beaches-boardwalk/',
      'Public ocean beaches from Atlantic City through Longport.'
    ),
    beachFeature(
      'Ocean City Beaches',
      'Cape May',
      'Ocean City',
      [
        [-74.570, 39.288],
        [-74.545, 39.280],
        [-74.664, 39.215],
        [-74.692, 39.226],
        [-74.570, 39.288]
      ],
      'Ocean City Beach',
      'https://www.ocnj.us/beach',
      'Ocean City oceanfront public swimming beaches.'
    ),
    beachFeature(
      'Strathmere and Sea Isle Beaches',
      'Cape May',
      'Upper Township, Sea Isle City',
      [
        [-74.696, 39.203],
        [-74.672, 39.196],
        [-74.718, 39.136],
        [-74.748, 39.146],
        [-74.696, 39.203]
      ],
      'Sea Isle City Beach',
      'https://www.visitsicnj.com/',
      'Public ocean beaches in Strathmere and Sea Isle City.'
    ),
    beachFeature(
      'Avalon and Stone Harbor Beaches',
      'Cape May',
      'Avalon, Stone Harbor',
      [
        [-74.733, 39.112],
        [-74.703, 39.103],
        [-74.765, 39.034],
        [-74.797, 39.046],
        [-74.733, 39.112]
      ],
      'Avalon Beaches',
      'https://avalonboro.net/beaches/',
      'Seven Mile Island oceanfront swimming beaches.'
    ),
    beachFeature(
      'The Wildwoods Beaches',
      'Cape May',
      'North Wildwood, Wildwood, Wildwood Crest',
      [
        [-74.789, 39.024],
        [-74.757, 39.017],
        [-74.830, 38.960],
        [-74.867, 38.974],
        [-74.789, 39.024]
      ],
      'Wildwoods Beaches',
      'https://wildwoodsnj.com/things-to-do/beaches/',
      'Wide free oceanfront beaches across the Wildwoods.'
    ),
    beachFeature(
      'Cape May Beaches',
      'Cape May',
      'Cape May, Cape May Point',
      [
        [-74.889, 38.947],
        [-74.870, 38.934],
        [-74.959, 38.925],
        [-74.973, 38.941],
        [-74.889, 38.947]
      ],
      'Cape May Beaches',
      'https://www.capemaycity.com/beach',
      'Cape May oceanfront public swimming beaches.'
    )
  ]
};

export default beachAreas;
