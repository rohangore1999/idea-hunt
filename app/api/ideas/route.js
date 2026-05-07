import { fetchSourceIdeas } from '@/lib/rss-fetcher'
import { SOURCES } from '@/lib/sources'

export const dynamic = 'force-dynamic'

function applySort(ideas, sort) {
  if (sort === 'top') return ideas.sort((a, b) => b.score - a.score)
  if (sort === 'comments') return ideas.sort((a, b) => b.comments - a.comments)
  return ideas.sort((a, b) => b.publishedAt - a.publishedAt)
}

function applyFilters(ideas, { source, category, confidence, q }) {
  if (source) {
    const sources = source.split(',')
    ideas = ideas.filter(i => sources.includes(i.sourceId))
  }
  if (category) {
    const categories = category.split(',')
    ideas = ideas.filter(i =>
      categories.includes(i.category) ||
      i.secondary.some(s => categories.includes(s))
    )
  }
  if (confidence === 'hide-low') {
    ideas = ideas.filter(i => i.confidence !== 'low')
  }
  if (q) {
    const query = q.toLowerCase()
    ideas = ideas.filter(i =>
      i.title.toLowerCase().includes(query) ||
      i.description.toLowerCase().includes(query)
    )
  }
  return ideas
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const filters = {
    source: searchParams.get('source'),
    category: searchParams.get('category'),
    sort: searchParams.get('sort') || 'top',
    confidence: searchParams.get('confidence'),
    q: searchParams.get('q'),
  }
  const encoder = new TextEncoder()
  const seenTitles = new Set()

  const stream = new ReadableStream({
    async start(controller) {
      // One promise per source; as each resolves, flush it immediately
      const sourcePromises = SOURCES.map(source =>
        fetchSourceIdeas(source).then(raw => {
          // Deduplicate by title across all sources
          const unique = raw.filter(idea => {
            const key = idea.title.toLowerCase().trim()
            if (seenTitles.has(key)) return false
            seenTitles.add(key)
            return true
          })
          const filtered = applyFilters(unique, filters)
          if (filtered.length === 0) return

          const sorted = applySort(filtered, filters.sort)
          const chunk = JSON.stringify({ type: 'ideas', sourceId: source.id, ideas: sorted })
          controller.enqueue(encoder.encode(chunk + '\n'))
        }).catch(err => {
          console.error(`[stream] ${source.id} error:`, err.message)
        })
      )

      await Promise.allSettled(sourcePromises)

      controller.enqueue(encoder.encode(JSON.stringify({ type: 'done' }) + '\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  })
}
