import { Suspense } from 'react'
import HomeClient from './HomeClient'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://idea-hunt.rohangore.com'

export async function generateMetadata({ searchParams }) {
  const params = await searchParams
  const ideaId = params?.idea

  if (!ideaId) return {}

  try {
    const res = await fetch(`${BASE_URL}/api/ideas/${ideaId}`, { cache: 'no-store' })
    if (!res.ok) return {}
    const { idea } = await res.json()
    if (!idea) return {}

    const ogImageUrl = `${BASE_URL}/og/idea?title=${encodeURIComponent(idea.title)}&source=${encodeURIComponent(idea.sourceId)}&category=${encodeURIComponent(idea.category)}&score=${idea.score}&author=${encodeURIComponent(idea.author)}`
    const shareUrl = `${BASE_URL}/?idea=${ideaId}`

    return {
      title: idea.title,
      description: idea.description?.slice(0, 160) || `A startup idea from ${idea.sourceName}`,
      openGraph: {
        title: idea.title,
        description: idea.description?.slice(0, 160) || `A startup idea from ${idea.sourceName}`,
        url: shareUrl,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: idea.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: idea.title,
        description: idea.description?.slice(0, 160) || `A startup idea from ${idea.sourceName}`,
        images: [ogImageUrl],
      },
    }
  } catch {
    return {}
  }
}

export default function Page() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  )
}
