import { NextResponse } from 'next/server'
import { fetchAllIdeas } from '@/lib/rss-fetcher'

export const revalidate = 21600

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const ideas = await fetchAllIdeas()
    const idea = ideas.find(i => i.id === id)

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    return NextResponse.json({ idea })
  } catch (err) {
    console.error('Failed to fetch idea by id:', err)
    return NextResponse.json({ error: 'Failed to fetch idea' }, { status: 500 })
  }
}
