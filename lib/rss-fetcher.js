import Parser from 'rss-parser'
import { SOURCES, INTENT_SIGNALS } from './sources'
import { classifyIdea } from './classifier'

const parser = new Parser()

function countIntentSignals(text) {
  const lower = text.toLowerCase()
  return INTENT_SIGNALS.filter(signal => lower.includes(signal)).length
}

function normalizeIdea(raw, sourceId) {
  const source = SOURCES.find(s => s.id === sourceId)
  const { category, secondary, confidence, score } = classifyIdea(
    raw.title,
    raw.description,
    raw.tags || [],
    raw.flair || ''
  )
  return {
    id: `${sourceId}_${raw.id}`,
    title: raw.title,
    description: raw.description || '',
    sourceId,
    sourceName: source.name,
    sourceUrl: raw.url,
    author: raw.author || 'unknown',
    score: raw.score || 0,
    comments: raw.comments || 0,
    publishedAt: raw.publishedAt,
    flair: raw.flair || null,
    category,
    secondary,
    confidence,
    classifierScore: score,
  }
}

async function fetchRedditRSS(source) {
  try {
    const res = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IdeaHunt/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      next: { revalidate: 21600 },
    })
    console.log(`[Reddit RSS] ${source.id} → ${res.status}`)
    if (!res.ok) {
      console.error(`[Reddit RSS] ${source.id} failed: ${res.status} ${res.statusText}`)
      return []
    }

    const xml = await res.text()
    const feed = await parser.parseString(xml)
    const items = feed?.items || []

    return items
      .filter(item => {
        const text = `${item.title || ''} ${item.contentSnippet || item.content || ''}`
        return countIntentSignals(text) >= source.minSignals
      })
      .map(item => {
        // Reddit RSS link looks like: https://www.reddit.com/r/xxx/comments/id/title/
        const idMatch = item.link?.match(/comments\/([a-z0-9]+)/)
        const id = idMatch ? idMatch[1] : Math.random().toString(36).slice(2)
        // Author is in <author> tag like "u/username"
        const author = item.author?.replace('/u/', '') || 'redditor'

        return normalizeIdea({
          id,
          title: item.title || '',
          description: item.contentSnippet || '',
          url: item.link || '',
          author,
          score: 0,
          comments: 0,
          publishedAt: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
          flair: '',
        }, source.id)
      })
  } catch (err) {
    console.error(`[Reddit RSS] ${source.id} error:`, err.message)
    return []
  }
}

async function fetchHN(source) {
  const results = await Promise.allSettled(
    source.urls.map(url =>
      fetch(url, { next: { revalidate: 21600 } })
        .then(r => r.text())
        .then(xml => parser.parseString(xml))
    )
  )

  const seen = new Set()
  const ideas = []

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    const items = result.value?.items || []

    for (const item of items) {
      const id = item.guid || item.link
      if (seen.has(id)) continue
      seen.add(id)

      ideas.push(normalizeIdea({
        id: id.replace(/\D/g, '').slice(-10),
        title: item.title || '',
        description: item.contentSnippet || item.content || '',
        url: item.comments || item.link || '',
        author: item.creator || 'HN User',
        score: 0,
        comments: 0,
        publishedAt: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
      }, source.id))
    }
  }

  return ideas
}

async function fetchDevTo(source) {
  const results = await Promise.allSettled(
    source.urls.map(url =>
      fetch(url, { next: { revalidate: 21600 } }).then(r => r.json())
    )
  )

  const seen = new Set()
  const ideas = []

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    const posts = result.value || []

    for (const post of posts) {
      if (seen.has(post.id)) continue
      seen.add(post.id)

      const text = `${post.title} ${post.description || ''}`
      if (countIntentSignals(text) < source.minSignals) continue

      ideas.push(normalizeIdea({
        id: String(post.id),
        title: post.title,
        description: post.description || '',
        url: post.url,
        author: post.user?.name || 'Dev.to',
        score: post.positive_reactions_count || 0,
        comments: post.comments_count || 0,
        publishedAt: post.published_at ? new Date(post.published_at).getTime() : Date.now(),
        tags: post.tag_list || [],
      }, source.id))
    }
  }

  return ideas
}

export async function fetchAllIdeas() {
  const fetchers = SOURCES.map(source => {
    if (source.type === 'reddit_rss') return fetchRedditRSS(source)
    if (source.type === 'rss') return fetchHN(source)
    if (source.type === 'devto') return fetchDevTo(source)
    return Promise.resolve([])
  })

  const results = await Promise.allSettled(fetchers)
  results.forEach((r, i) => {
    const src = SOURCES[i]
    if (r.status === 'fulfilled') {
      console.log(`[fetchAllIdeas] ${src.id} → ${r.value.length} ideas`)
    } else {
      console.error(`[fetchAllIdeas] ${src.id} rejected:`, r.reason)
    }
  })

  const ideas = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)

  // Deduplicate by title similarity (exact match)
  const seen = new Set()
  return ideas.filter(idea => {
    const key = idea.title.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
