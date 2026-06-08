// AI_CHANGE:
// Tool: Codex
// Model: GPT-5
// Timestamp: 2026-06-08T13:29:19-04:00
// Purpose: Seeds a Weird NJ layer with public, approximate locations and source references.
// Reason: Users requested a Weird NJ layer, but the app should avoid reproducing copyrighted book or magazine content while still mapping well-known public subjects.
const weirdNjLocations = [
  {
    name: 'Clinton Road',
    category: 'Roads Less Traveled',
    town: 'West Milford',
    county: 'Passaic',
    position: [41.139, -74.422],
    note: 'Approximate midpoint of the byway.',
    sourceTitle: 'Weird NJ Presents: Tales From Clinton Road',
    sourceUrl: 'https://store.weirdnj.com/products/tales-from-clinton-road'
  },
  {
    name: 'Shades of Death Road',
    category: 'Roads Less Traveled',
    town: 'Great Meadows',
    county: 'Warren',
    position: [40.885, -74.914],
    note: 'Approximate road corridor.',
    sourceTitle: 'Weird NJ #8 / #50 issue listings',
    sourceUrl: 'https://store.weirdnj.com/products/weird-nj-8'
  },
  {
    name: "Devil's Tree",
    category: 'Local Legends',
    town: 'Bernards Township',
    county: 'Somerset',
    position: [40.655, -74.578],
    note: 'Approximate Mountain Road area.',
    sourceTitle: 'Weird NJ Issue Index',
    sourceUrl: 'https://index.weirdnj.com/'
  },
  {
    name: 'Gates of Hell',
    category: 'Underground',
    town: 'Clifton',
    county: 'Passaic',
    position: [40.884, -74.171],
    note: 'Approximate Clifton storm-drain legend area; verify safety and access.',
    sourceTitle: 'Weird NJ Issue Index',
    sourceUrl: 'https://index.weirdnj.com/'
  },
  {
    name: "Ong's Hat",
    category: 'Ancient Mysteries',
    town: 'Pemberton Township',
    county: 'Burlington',
    position: [39.963, -74.625],
    note: 'Approximate Pine Barrens settlement area.',
    sourceTitle: 'Weird NJ Issue Index',
    sourceUrl: 'https://index.weirdnj.com/'
  },
  {
    name: 'Jenny Jump State Forest',
    category: 'Unexplained Phenomena',
    town: 'Hope',
    county: 'Warren',
    position: [40.921, -74.917],
    note: 'Approximate state forest location.',
    sourceTitle: 'Weird NJ #36 issue listing',
    sourceUrl: 'https://store.weirdnj.com/products/weird-nj-36'
  },
  {
    name: 'Paulinskill Viaduct',
    category: 'Abandoned',
    town: 'Knowlton Township',
    county: 'Warren',
    position: [40.953, -75.061],
    note: 'Approximate viaduct location.',
    sourceTitle: 'Weird NJ #36 issue listing',
    sourceUrl: 'https://store.weirdnj.com/products/weird-nj-36'
  },
  {
    name: 'Wanaque Reservoir UFO Area',
    category: 'Unexplained Phenomena',
    town: 'Wanaque',
    county: 'Passaic',
    position: [41.044, -74.295],
    note: 'Approximate reservoir area.',
    sourceTitle: 'Weird NJ #8 / #46 issue listings',
    sourceUrl: 'https://store.weirdnj.com/products/weird-nj-8'
  },
  {
    name: 'Cape May Bunker',
    category: 'Mystery History',
    town: 'Cape May Point',
    county: 'Cape May',
    position: [38.933, -74.963],
    note: 'Approximate beach bunker location.',
    sourceTitle: 'Weird NJ #39 issue listing',
    sourceUrl: 'https://store.weirdnj.com/products/weird-nj-39'
  },
  {
    name: 'Tillie',
    category: 'Roadside Oddities',
    town: 'Asbury Park',
    county: 'Monmouth',
    position: [40.22, -74.002],
    note: 'Approximate Asbury Park boardwalk icon location.',
    sourceTitle: 'Weird NJ #61 issue listing',
    sourceUrl: 'https://store.weirdnj.com/products/weird-nj-61-fall-winter-2023'
  },
  {
    name: 'Lucy the Elephant',
    category: 'Roadside Oddities',
    town: 'Margate City',
    county: 'Atlantic',
    position: [39.3218, -74.511],
    note: 'Public roadside oddity.',
    sourceTitle: 'Weird NJ Issue Index',
    sourceUrl: 'https://index.weirdnj.com/'
  },
  {
    name: 'Jungle Habitat',
    category: 'Abandoned',
    town: 'West Milford',
    county: 'Passaic',
    position: [41.141, -74.347],
    note: 'Approximate former theme park area.',
    sourceTitle: 'Weird NJ #38 / #50 issue listings',
    sourceUrl: 'https://store.weirdnj.com/products/weird-nj-38'
  },
  {
    name: 'Overbrook',
    category: 'Abandoned',
    town: 'Cedar Grove',
    county: 'Essex',
    position: [40.858, -74.232],
    note: 'Approximate former hospital campus area.',
    sourceTitle: 'Weird NJ #36 / #50 issue listings',
    sourceUrl: 'https://store.weirdnj.com/products/weird-nj-36'
  },
  {
    name: "Devil's Tower",
    category: 'Fabled People and Places',
    town: 'Alpine',
    county: 'Bergen',
    position: [40.955, -73.922],
    note: 'Approximate tower location.',
    sourceTitle: 'Weird NJ Issue Index',
    sourceUrl: 'https://index.weirdnj.com/'
  },
  {
    name: 'Hindenburg Crash Site',
    category: 'Mystery History',
    town: 'Manchester Township',
    county: 'Ocean',
    position: [40.0304, -74.3257],
    note: 'Approximate Lakehurst crash memorial area.',
    sourceTitle: 'Weird NJ Issue Index',
    sourceUrl: 'https://index.weirdnj.com/'
  }
];

export default weirdNjLocations;
