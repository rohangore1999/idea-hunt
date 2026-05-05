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
    type: 'pullpush',
    subreddit: 'SomebodyMakeThis',
    minSignals: 0,
  },
  {
    id: 'reddit_appideas',
    name: 'r/AppIdeas',
    shortName: 'r/AppIdeas',
    color: '#FF9E5E',
    bgColor: 'rgba(255,158,94,0.12)',
    type: 'pullpush',
    subreddit: 'AppIdeas',
    minSignals: 0,
  },
  {
    id: 'reddit_entrepreneur',
    name: 'r/Entrepreneur',
    shortName: 'r/Entrepreneur',
    color: '#FFB84D',
    bgColor: 'rgba(255,184,77,0.12)',
    type: 'pullpush',
    subreddit: 'Entrepreneur',
    minSignals: 1,
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    shortName: 'Hacker News',
    color: '#4ADE80',
    bgColor: 'rgba(74,222,128,0.12)',
    type: 'rss',
    urls: [
      'https://hnrss.org/newest?q=steal+this+idea&count=30',
      'https://hnrss.org/newest?q=someone+should+build&count=30',
      'https://hnrss.org/newest?q=wish+there+was&count=30',
      'https://hnrss.org/newest?q=startup+idea&count=30',
      'https://hnrss.org/newest?q=product+idea&count=30',
      'https://hnrss.org/newest?q=nobody+has+built&count=30',
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
      'https://dev.to/api/articles?tag=buildinpublic&per_page=30',
      'https://dev.to/api/articles?tag=indiehackers&per_page=30',
      'https://dev.to/api/articles?tag=startup&per_page=30',
      'https://dev.to/api/articles?tag=sideproject&per_page=30',
    ],
    minSignals: 1,
  },
]

export const SOURCE_MAP = Object.fromEntries(SOURCES.map(s => [s.id, s]))
