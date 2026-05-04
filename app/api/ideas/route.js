import { NextResponse } from 'next/server'
import { fetchAllIdeas } from '@/lib/rss-fetcher'

export const revalidate = 0 // no cache — force fresh fetch every request (temporary for debugging)

const PAGE_SIZE = 20

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'latest'
    const confidence = searchParams.get('confidence')
    const q = searchParams.get('q')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

    let ideas = await fetchAllIdeas()

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

    if (sort === 'top') {
      ideas.sort((a, b) => b.score - a.score)
    } else if (sort === 'comments') {
      ideas.sort((a, b) => b.comments - a.comments)
    } else {
      ideas.sort((a, b) => b.publishedAt - a.publishedAt)
    }

    const total = ideas.length
    const totalPages = Math.ceil(total / PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    const paginatedIdeas = ideas.slice(start, start + PAGE_SIZE)

    return NextResponse.json({
      ideas: paginatedIdeas,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    })
  } catch (err) {
    console.error('Failed to fetch ideas:', err)
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 })
  }
}
