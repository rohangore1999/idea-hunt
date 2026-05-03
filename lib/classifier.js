const CATEGORIES = {
  'AI / ML': {
    primary: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'gpt', 'llm', 'chatbot', 'nlp', 'computer vision', 'neural', 'openai', 'automation'],
    secondary: ['smart', 'intelligent', 'automated', 'generated', 'model', 'predict'],
    phrases: ['ai-powered', 'using ai', 'with ai', 'ai that', 'train a model', 'language model'],
  },
  'Developer Tools': {
    primary: ['developer', 'devtools', 'cli', 'sdk', 'library', 'framework', 'open source', 'github', 'npm', 'package', 'debugging', 'deployment', 'devops', 'docker', 'api'],
    secondary: ['terminal', 'backend', 'frontend', 'database', 'code', 'coding', 'programming'],
    phrases: ['for developers', 'dev tool', 'build tool', 'would help devs', 'open source'],
  },
  'B2B / SaaS': {
    primary: ['saas', 'b2b', 'enterprise', 'business', 'dashboard', 'workflow', 'integration', 'crm', 'invoice', 'billing', 'team', 'collaboration'],
    secondary: ['productivity', 'manage', 'pipeline', 'onboarding', 'startup'],
    phrases: ['for businesses', 'for teams', 'for companies', 'alternative to', 'replace'],
  },
  'Consumer Apps': {
    primary: ['app', 'mobile', 'ios', 'android', 'phone', 'notification', 'reminder', 'habit', 'tracker', 'personal', 'lifestyle'],
    secondary: ['daily', 'routine', 'social', 'friends', 'share', 'photo'],
    phrases: ['would be nice if', 'i wish there was an app', 'someone should make', 'missing app'],
  },
  'FinTech': {
    primary: ['finance', 'fintech', 'money', 'payment', 'banking', 'crypto', 'investment', 'budget', 'expense', 'tax', 'wallet', 'loan', 'stock', 'trading', 'insurance'],
    secondary: ['save', 'spend', 'earn', 'transfer', 'transaction', 'pricing'],
    phrases: ['manage money', 'track expenses', 'financial', 'pay for', 'split bill'],
  },
  'Health & Wellness': {
    primary: ['health', 'wellness', 'fitness', 'mental health', 'therapy', 'doctor', 'medical', 'workout', 'nutrition', 'diet', 'sleep', 'meditation', 'calories', 'exercise'],
    secondary: ['anxiety', 'stress', 'mood', 'weight', 'heart', 'hospital'],
    phrases: ['health tracking', 'for patients', 'mental health', 'stay healthy', 'workout app'],
  },
  'Education': {
    primary: ['education', 'learning', 'course', 'tutorial', 'study', 'school', 'university', 'students', 'teaching', 'quiz', 'skill', 'certification', 'flashcard'],
    secondary: ['learn', 'teach', 'practice', 'knowledge', 'exam'],
    phrases: ['learn to', 'for students', 'educational', 'study tool', 'teaching platform'],
  },
  'E-commerce': {
    primary: ['ecommerce', 'shop', 'store', 'marketplace', 'product', 'sell', 'buy', 'shipping', 'inventory', 'vendor', 'cart', 'checkout', 'order', 'listing', 'delivery'],
    secondary: ['price', 'discount', 'deal', 'customer', 'retail'],
    phrases: ['online store', 'sell products', 'for sellers', 'marketplace for', 'buy and sell'],
  },
  'Social Impact': {
    primary: ['environment', 'sustainability', 'climate', 'charity', 'nonprofit', 'community', 'volunteering', 'green', 'eco', 'carbon', 'donation', 'activism'],
    secondary: ['impact', 'cause', 'awareness', 'local', 'planet'],
    phrases: ['help people', 'for the community', 'save the', 'reduce waste', 'social cause'],
  },
  'Gaming': {
    primary: ['game', 'gaming', 'entertainment', 'fun', 'play', 'stream', 'esports', 'multiplayer', 'puzzle', 'leaderboard'],
    secondary: ['player', 'level', 'score', 'watch', 'media'],
    phrases: ['game for', 'fun app', 'for gamers', 'streaming platform'],
  },
  'Real Estate': {
    primary: ['real estate', 'property', 'rent', 'apartment', 'house', 'landlord', 'tenant', 'mortgage', 'lease', 'listing', 'housing', 'neighborhood'],
    secondary: ['buy', 'sell', 'agent', 'location', 'move'],
    phrases: ['find a home', 'for renters', 'property management'],
  },
  'Transport': {
    primary: ['transport', 'logistics', 'delivery', 'shipping', 'fleet', 'driver', 'vehicle', 'route', 'supply chain', 'ride', 'commute', 'traffic', 'parking'],
    secondary: ['car', 'truck', 'map', 'navigate'],
    phrases: ['last mile', 'delivery app', 'for drivers'],
  },
  'Food & Beverage': {
    primary: ['food', 'restaurant', 'recipe', 'cooking', 'meal', 'grocery', 'nutrition', 'chef', 'kitchen', 'ingredient', 'menu'],
    secondary: ['eat', 'drink', 'taste', 'cuisine', 'cafe'],
    phrases: ['meal planning', 'food delivery', 'recipe app', 'for restaurants', 'cooking helper'],
  },
  'Productivity': {
    primary: ['productivity', 'task', 'todo', 'notes', 'calendar', 'planning', 'time management', 'focus', 'organize', 'schedule', 'goal'],
    secondary: ['work', 'efficiency', 'routine', 'priority', 'deadlines', 'reminder'],
    phrases: ['stay organized', 'manage tasks', 'time tracker', 'productivity tool', 'for busy people'],
  },
}

const FLAIR_TO_CATEGORY = {
  'software': 'Developer Tools',
  'hardware': 'Developer Tools',
  'app': 'Consumer Apps',
  'mobile': 'Consumer Apps',
  'game': 'Gaming',
  'finance': 'FinTech',
  'health': 'Health & Wellness',
  'education': 'Education',
  'business': 'B2B / SaaS',
  'ai': 'AI / ML',
}

export function classifyIdea(title = '', description = '', tags = [], flair = '') {
  const text = `${title} ${description} ${tags.join(' ')}`.toLowerCase()
  const scores = {}

  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    let score = 0
    keywords.primary.forEach(kw => { if (text.includes(kw)) score += 3 })
    keywords.secondary.forEach(kw => { if (text.includes(kw)) score += 1 })
    keywords.phrases.forEach(phrase => { if (text.includes(phrase)) score += 5 })
    if (score > 0) scores[category] = score
  }

  // Boost score using Reddit flair as extra signal
  if (flair) {
    const flairCategory = FLAIR_TO_CATEGORY[flair.toLowerCase()]
    if (flairCategory) {
      scores[flairCategory] = (scores[flairCategory] || 0) + 4
    }
  }

  if (Object.keys(scores).length === 0) {
    return { category: 'General', secondary: [], confidence: 'low', score: 0 }
  }

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)
  const topScore = sorted[0][1]

  return {
    category: sorted[0][0],
    secondary: sorted.slice(1, 3).map(([cat]) => cat),
    confidence: topScore >= 10 ? 'high' : topScore >= 5 ? 'medium' : 'low',
    score: topScore,
  }
}

export const CATEGORY_ICONS = {
  'AI / ML': '🤖',
  'Developer Tools': '🛠️',
  'B2B / SaaS': '💼',
  'Consumer Apps': '📱',
  'FinTech': '💰',
  'Health & Wellness': '🏥',
  'Education': '🎓',
  'E-commerce': '🛒',
  'Social Impact': '🌍',
  'Gaming': '🎮',
  'Real Estate': '🏠',
  'Transport': '🚗',
  'Food & Beverage': '🍔',
  'Productivity': '🔧',
  'General': '💡',
}

export const ALL_CATEGORIES = Object.keys(CATEGORIES).concat(['General'])
