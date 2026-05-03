export const INTENT_SIGNALS = [
  'idea', 'build', 'app', 'tool', 'platform',
  'wish', 'should', 'need', 'want', 'create', 'make'
]

export const SOURCES = [
  {
    id: 'reddit_smt',
    name: 'r/SomebodyMakeThis',
    shortName: 'r/SomebodyMakeThis',
    color: '#FF6B4A',
    bgColor: 'rgba(255,107,74,0.12)',
    type: 'reddit',
    url: 'https://www.reddit.com/r/SomebodyMakeThis/new/.json?limit=25',
    minSignals: 1,
  },
  {
    id: 'reddit_appideas',
    name: 'r/AppIdeas',
    shortName: 'r/AppIdeas',
    color: '#FF9E5E',
    bgColor: 'rgba(255,158,94,0.12)',
    type: 'reddit',
    url: 'https://www.reddit.com/r/AppIdeas/new/.json?limit=25',
    minSignals: 2,
  },
  {
    id: 'reddit_entrepreneur',
    name: 'r/Entrepreneur',
    shortName: 'r/Entrepreneur',
    color: '#FFB84D',
    bgColor: 'rgba(255,184,77,0.12)',
    type: 'reddit',
    url: 'https://www.reddit.com/r/Entrepreneur/new/.json?limit=25',
    minSignals: 3,
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    shortName: 'Hacker News',
    color: '#4ADE80',
    bgColor: 'rgba(74,222,128,0.12)',
    type: 'rss',
    urls: [
      'https://hnrss.org/newest?q=steal+this+idea&count=10',
      'https://hnrss.org/newest?q=someone+should+build&count=10',
      'https://hnrss.org/newest?q=wish+there+was&count=10',
      'https://hnrss.org/newest?q=startup+idea&count=10',
    ],
    minSignals: 0,
  },
  {
    id: 'devto',
    name: 'Dev.to',
    shortName: 'Dev.to',
    color: '#38BDF8',
    bgColor: 'rgba(56,189,248,0.12)',
    type: 'devto',
    urls: [
      'https://dev.to/api/articles?tag=buildinpublic&per_page=10',
      'https://dev.to/api/articles?tag=indiehackers&per_page=10',
    ],
    minSignals: 2,
  },
]

export const SOURCE_MAP = Object.fromEntries(SOURCES.map(s => [s.id, s]))
