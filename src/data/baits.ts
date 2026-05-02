export interface BaitInfo {
  name: string;
  type: 'Natural' | 'Artificial';
  attracts: string[];
  bestConditions: string;
  bestLocations: string;
  description: string;
}

export const BAIT_LIBRARY: BaitInfo[] = [
  {
    name: 'Live Worms',
    type: 'Natural',
    attracts: ['Bluegill', 'Catfish', 'Bass', 'Trout', 'Walleye'],
    bestConditions: 'Low light, after rain, or murky water.',
    bestLocations: 'Bottom of ponds, slow-moving rivers, under docks.',
    description: 'The universal bait. Effective for almost any freshwater species.'
  },
  {
    name: 'Crickets',
    type: 'Natural',
    attracts: ['Bluegill', 'Panfish', 'Trout'],
    bestConditions: 'Warm summer days, calm water.',
    bestLocations: 'Near overhanging trees or grassy banks.',
    description: 'Excellent for surface-feeding panfish during the summer months.'
  },
  {
    name: 'Shrimp',
    type: 'Natural',
    attracts: ['Redfish', 'Snook', 'Catfish', 'Striped Bass'],
    bestConditions: 'Tidal movements, stained water.',
    bestLocations: 'Mangroves, piers, or deep channels.',
    description: 'A staple for saltwater and certain freshwater species like catfish.'
  },
  {
    name: 'Plastic Worms',
    type: 'Artificial',
    attracts: ['Largemouth Bass', 'Smallmouth Bass'],
    bestConditions: 'Clear to stained water, any temperature.',
    bestLocations: 'Weed beds, submerged logs, rock piles.',
    description: 'Highly versatile. Can be rigged many ways (Texas, Carolina, Ned).'
  },
  {
    name: 'Topwater Lures',
    type: 'Artificial',
    attracts: ['Bass', 'Pike', 'Muskie'],
    bestConditions: 'Calm water, dawn or dusk (low light).',
    bestLocations: 'Surface of weed beds, lily pads, or shadows.',
    description: 'Exciting surface strikes. Best when fish are looking up.'
  },
  {
    name: 'Jigs',
    type: 'Artificial',
    attracts: ['Bass', 'Walleye', 'Crappie'],
    bestConditions: 'Cold water or deep structure.',
    bestLocations: 'Vertical structure, drop-offs, bridge pilings.',
    description: 'Precise depth control. Great for targeting specific structures.'
  },
  {
    name: 'Spinnerbaits',
    type: 'Artificial',
    attracts: ['Bass', 'Northern Pike'],
    bestConditions: 'Windy days, murky water.',
    bestLocations: 'Shallow flats, around brush, or wind-blown points.',
    description: 'Creates a lot of vibration and flash to trigger aggressive strikes.'
  },
  {
    name: 'Crankbaits',
    type: 'Artificial',
    attracts: ['Bass', 'Walleye', 'Trout'],
    bestConditions: 'Active fish, clear to stained water.',
    bestLocations: 'Deep ledges, rock bars, open water.',
    description: 'Covers a lot of water quickly. Mimics swimming baitfish.'
  }
];
