// AI_CHANGE:
// Tool: Codex
// Model: GPT-5
// Timestamp: 2026-06-08T17:21:18-04:00
// Purpose: Seeds and expands the Attractions layer with public destination locations and source links.
// Reason: Users requested a broader Attractions layer after noticing major landmarks such as High Point Monument were missing.
const attractionLocations = [
  {
    name: 'High Point Monument',
    category: 'Monument and Scenic Overlook',
    town: 'Wantage / Montague',
    county: 'Sussex',
    position: [41.3212, -74.6616],
    note: 'Veterans memorial obelisk at New Jersey’s highest point in High Point State Park.',
    sourceTitle: 'NJDEP High Point Monument',
    sourceUrl: 'https://dep.nj.gov/parksandforests/state-park/high-point-monument/'
  },
  {
    name: 'Wild West City',
    category: 'Theme Park',
    town: 'Stanhope',
    county: 'Sussex',
    position: [40.9328, -74.7187],
    note: 'Old West-themed family attraction in the Skylands region.',
    sourceTitle: 'Wild West City',
    sourceUrl: 'https://wildwestcity.com/'
  },
  {
    name: 'Waterloo Village',
    category: 'Historic Village',
    town: 'Stanhope',
    county: 'Sussex',
    position: [40.9135, -74.7555],
    note: 'Restored 19th-century Morris Canal village in Allamuchy Mountain State Park.',
    sourceTitle: 'NJDEP Waterloo Village',
    sourceUrl: 'https://dep.nj.gov/parksandforests/state-park/waterloo-village/'
  },
  {
    name: 'Space Farms Zoo & Museum',
    category: 'Zoo and Museum',
    town: 'Sussex',
    county: 'Sussex',
    position: [41.2377, -74.7464],
    note: 'Roadside zoo and museum at 218 County Road 519.',
    sourceTitle: 'Space Farms Zoo & Museum',
    sourceUrl: 'https://spacefarms.com/contact/'
  },
  {
    name: 'Quiet Valley Living Historical Farm',
    category: 'Living History',
    town: 'Stroudsburg',
    county: 'Monroe, PA',
    placeLabel: 'Stroudsburg, Monroe County, PA',
    position: [40.9852, -75.2419],
    note: 'Nearby Pennsylvania living history farm included as a regional attraction.',
    sourceTitle: 'Quiet Valley Living Historical Farm',
    sourceUrl: 'https://quietvalley.org/about/'
  },
  {
    name: 'The Land of Make Believe',
    category: 'Amusement and Water Park',
    town: 'Hope',
    county: 'Warren',
    position: [40.9078, -74.9558],
    note: 'Family amusement and water park on Great Meadows Road.',
    sourceTitle: 'Land of Make Believe',
    sourceUrl: 'https://www.lomb.com/'
  },
  {
    name: 'Storybook Land',
    category: 'Theme Park',
    town: 'Egg Harbor Township',
    county: 'Atlantic',
    position: [39.422, -74.5912],
    note: 'Storybook-themed family amusement park.',
    sourceTitle: 'Storybook Land',
    sourceUrl: 'https://storybookland.com/'
  },
  {
    name: 'Barnegat Lighthouse',
    category: 'Lighthouse',
    town: 'Barnegat Light',
    county: 'Ocean',
    position: [39.7642, -74.1068],
    note: 'Iconic “Old Barney” lighthouse at the northern tip of Long Beach Island.',
    sourceTitle: 'NJDEP Barnegat Lighthouse State Park',
    sourceUrl: 'https://dep.nj.gov/parksandforests/state-park/barnegat-lighthouse-state-park/'
  },
  {
    name: 'Liberty Science Center',
    category: 'Science Museum',
    town: 'Jersey City',
    county: 'Hudson',
    position: [40.7086, -74.0542],
    note: 'Large interactive science museum in Liberty State Park.',
    sourceTitle: 'Liberty Science Center',
    sourceUrl: 'https://lsc.org/'
  },
  {
    name: 'Battleship New Jersey',
    category: 'Museum Ship',
    town: 'Camden',
    county: 'Camden',
    position: [39.9396, -75.1322],
    note: 'Historic Iowa-class battleship museum on the Camden waterfront.',
    sourceTitle: 'Battleship New Jersey',
    sourceUrl: 'https://www.battleshipnewjersey.org/'
  },
  {
    name: 'Lucy the Elephant',
    category: 'Roadside Oddity',
    town: 'Margate City',
    county: 'Atlantic',
    position: [39.3208, -74.5116],
    note: 'Historic elephant-shaped landmark on the shore.',
    sourceTitle: 'Lucy the Elephant',
    sourceUrl: 'https://lucytheelephant.org/'
  },
  {
    name: 'Grounds For Sculpture',
    category: 'Art Park',
    town: 'Hamilton Township',
    county: 'Mercer',
    position: [40.2354, -74.7178],
    note: 'Large outdoor sculpture park and museum.',
    sourceTitle: 'Grounds For Sculpture',
    sourceUrl: 'https://www.groundsforsculpture.org/'
  },
  {
    name: 'Duke Farms',
    category: 'Estate and Nature Preserve',
    town: 'Hillsborough',
    county: 'Somerset',
    position: [40.7216, -74.7134],
    note: 'Historic estate, gardens, trails, and conservation landscape.',
    sourceTitle: 'Duke Farms',
    sourceUrl: 'https://www.dukefarms.org/'
  },
  {
    name: 'Paterson Great Falls',
    category: 'Waterfall and National Park',
    town: 'Paterson',
    county: 'Passaic',
    position: [40.9168, -74.1801],
    note: 'Major Passaic River waterfall and national historical park.',
    sourceTitle: 'National Park Service Paterson Great Falls',
    sourceUrl: 'https://www.nps.gov/pagr/index.htm'
  },
  {
    name: 'Thomas Edison National Historical Park',
    category: 'Historic Site',
    town: 'West Orange',
    county: 'Essex',
    position: [40.7851, -74.2387],
    note: 'Thomas Edison’s laboratory complex and Glenmont estate.',
    sourceTitle: 'National Park Service Thomas Edison',
    sourceUrl: 'https://www.nps.gov/edis/index.htm'
  },
  {
    name: 'Diggerland USA',
    category: 'Theme Park',
    town: 'West Berlin',
    county: 'Camden',
    position: [39.8127, -74.9229],
    note: 'Construction-themed amusement and water park.',
    sourceTitle: 'Diggerland USA',
    sourceUrl: 'https://diggerlandusa.com/'
  },
  {
    name: 'Adventure Aquarium',
    category: 'Aquarium',
    town: 'Camden',
    county: 'Camden',
    position: [39.9454, -75.1315],
    note: 'Waterfront aquarium on the Camden side of the Delaware River.',
    sourceTitle: 'Adventure Aquarium',
    sourceUrl: 'https://www.adventureaquarium.com/'
  },
  {
    name: 'Cape May Lighthouse',
    category: 'Lighthouse',
    town: 'Cape May Point',
    county: 'Cape May',
    position: [38.9338, -74.9601],
    note: 'Historic lighthouse in Cape May Point State Park.',
    sourceTitle: 'Cape May MAC Cape May Lighthouse',
    sourceUrl: 'https://capemaymac.org/experience/cape-may-lighthouse/'
  },
  {
    name: 'Sterling Hill Mining Museum',
    category: 'Museum',
    town: 'Ogdensburg',
    county: 'Sussex',
    position: [41.0834, -74.6043],
    note: 'Historic zinc mine and fluorescent mineral museum.',
    sourceTitle: 'Sterling Hill Mining Museum',
    sourceUrl: 'https://www.sterlinghillminingmuseum.org/'
  },
  {
    name: 'Lakota Wolf Preserve',
    category: 'Wildlife Preserve',
    town: 'Columbia',
    county: 'Warren',
    position: [40.9568, -75.0389],
    note: 'Wolf preserve in the Delaware Water Gap area.',
    sourceTitle: 'Lakota Wolf Preserve',
    sourceUrl: 'https://lakotawolf.com/'
  },
  {
    name: 'Turtle Back Zoo',
    category: 'Zoo',
    town: 'West Orange',
    county: 'Essex',
    position: [40.7674, -74.2801],
    note: 'Essex County zoo near South Mountain Reservation.',
    sourceTitle: 'Turtle Back Zoo',
    sourceUrl: 'https://turtlebackzoo.com/'
  },
  {
    name: 'Six Flags Great Adventure',
    category: 'Theme Park',
    town: 'Jackson Township',
    county: 'Ocean',
    position: [40.1344, -74.4417],
    note: 'Major amusement park and safari attraction.',
    sourceTitle: 'Six Flags Great Adventure',
    sourceUrl: 'https://www.sixflags.com/greatadventure'
  },
  {
    name: 'Cape May County Park & Zoo',
    category: 'Zoo',
    town: 'Cape May Court House',
    county: 'Cape May',
    position: [39.1017, -74.8151],
    note: 'County park zoo in Middle Township.',
    sourceTitle: 'Cape May County Park & Zoo',
    sourceUrl: 'https://capemaycountynj.gov/1008/Park-Zoo'
  }
];

export default attractionLocations;
