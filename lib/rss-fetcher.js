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

async function fetchReddit(source) {
  const res = await fetch(source.url, {
    headers: { 'User-Agent': 'IdeaHunt/1.0 (learning project)' },
    next: { revalidate: 21600 },
  })
  if (!res.ok) return []

  const data = await res.json()
  const posts = data?.data?.children || []

  return posts
    .map(p => p.data)
    .filter(p => {
      const text = `${p.title} ${p.selftext || ''}`
      return countIntentSignals(text) >= source.minSignals
    })
    .map(p => normalizeIdea({
      id: p.id,
      title: p.title,
      description: p.selftext || '',
      url: `https://reddit.com${p.permalink}`,
      author: p.author,
      score: p.score,
      comments: p.num_comments,
      publishedAt: p.created_utc * 1000,
      flair: p.link_flair_text || '',
    }, source.id))
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
    if (source.type === 'reddit') return fetchReddit(source)
    if (source.type === 'rss') return fetchHN(source)
    if (source.type === 'devto') return fetchDevTo(source)
    return Promise.resolve([])
  })

  const results = await Promise.allSettled(fetchers)
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
