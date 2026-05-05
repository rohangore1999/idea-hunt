'use client'

import { useState, useEffect } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import IdeaCard from './IdeaCard'

const SKELETON_CONFIGS = [
  { titleLines: 2, hasDesc: true,  descLines: 3, tags: 2 },
  { titleLines: 1, hasDesc: false, descLines: 0, tags: 1 },
  { titleLines: 3, hasDesc: true,  descLines: 4, tags: 2 },
  { titleLines: 2, hasDesc: true,  descLines: 2, tags: 1 },
  { titleLines: 1, hasDesc: true,  descLines: 3, tags: 2 },
  { titleLines: 2, hasDesc: false, descLines: 0, tags: 1 },
  { titleLines: 3, hasDesc: true,  descLines: 2, tags: 2 },
  { titleLines: 1, hasDesc: true,  descLines: 4, tags: 1 },
  { titleLines: 2, hasDesc: true,  descLines: 3, tags: 2 },
  { titleLines: 1, hasDesc: false, descLines: 0, tags: 2 },
  { titleLines: 3, hasDesc: true,  descLines: 2, tags: 1 },
  { titleLines: 2, hasDesc: true,  descLines: 3, tags: 2 },
]

function CardSkeleton({ config }) {
  const { titleLines, hasDesc, descLines, tags } = config
  return (
    <div className="w-full bg-[#1a1a1a] rounded-lg border border-white/8 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 animate-pulse">
      {/* source label */}
      <div className="h-2.5 w-16 rounded bg-white/10" />
      {/* title */}
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: titleLines }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-white/10"
            style={{ width: i === titleLines - 1 ? '65%' : '100%' }}
          />
        ))}
      </div>
      {/* description */}
      {hasDesc && (
        <div className="flex flex-col gap-1">
          {Array.from({ length: descLines }).map((_, i) => (
            <div
              key={i}
              className="h-3 rounded bg-white/6"
              style={{ width: i === descLines - 1 ? '75%' : '100%' }}
            />
          ))}
        </div>
      )}
      {/* tags */}
      <div className="flex gap-1.5 mt-1">
        {Array.from({ length: tags }).map((_, i) => (
          <div key={i} className="h-5 w-16 rounded bg-white/8" />
        ))}
      </div>
      {/* footer */}
      <div className="flex justify-between pt-2 border-t border-white/8">
        <div className="h-3 w-8 rounded bg-white/8" />
        <div className="h-3 w-12 rounded bg-white/8" />
      </div>
    </div>
  )
}

export default function MasonryGrid({ ideas, loading, onCardClick }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  if (loading) {
    return (
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 1024: 3, 1440: 4 }}>
        <Masonry gutter="4px">
          {SKELETON_CONFIGS.map((config, i) => <CardSkeleton key={i} config={config} />)}
        </Masonry>
      </ResponsiveMasonry>
    )
  }

  if (!ideas?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-white/30">
        <span className="text-4xl mb-3">💡</span>
        <p className="text-sm font-medium">No ideas found</p>
        <p className="text-xs mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 1024: 3, 1440: 4 }}>
      <Masonry gutter="4px">
        {ideas.map((idea, index) => (
          <IdeaCard key={idea.id} idea={idea} onClick={onCardClick} index={index} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  )
}
