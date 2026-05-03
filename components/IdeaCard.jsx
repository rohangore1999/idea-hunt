'use client'

import { motion } from 'framer-motion'
import { SOURCE_MAP } from '@/lib/sources'
import { ArrowUp } from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils'

export default function IdeaCard({ idea, onClick, index = 0 }) {
  const source = SOURCE_MAP[idea.sourceId]
  const glowColor = source?.color || '#ffffff'

  const handleSourceClick = (e) => {
    e.stopPropagation()
    window.open(idea.sourceUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.6), ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={() => onClick(idea)}
      className="group relative w-full bg-[#1a1a1a] rounded-lg border border-white/8 p-3 sm:p-4 cursor-pointer flex flex-col gap-2 sm:gap-3 transition-colors duration-200"
      style={{ '--glow': glowColor }}
    >
      {/* Gradient glow border on hover */}
      <span
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${glowColor}22, ${glowColor}08)`,
          boxShadow: `0 0 0 1px ${glowColor}55, 0 4px 24px ${glowColor}30`,
        }}
      />
      {/* Source label */}
      <span
        className="text-[10px] font-bold tracking-widest uppercase"
        style={{ color: source?.color }}
      >
        {source?.shortName}
      </span>

      {/* Title */}
      <h3 className="text-[13px] sm:text-[15px] font-bold text-white leading-snug">
        {idea.title}
      </h3>

      {/* Description */}
      {idea.description && (
        <p className="text-[11px] sm:text-xs text-white/45 leading-relaxed line-clamp-4">
          {idea.description}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/8 text-white/60 uppercase tracking-wide">
          {idea.category}
        </span>
        {idea.secondary?.slice(0, 1).map(cat => (
          <span
            key={cat}
            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/8 text-white/40 uppercase tracking-wide"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/8">
        <div className="flex items-center gap-1 text-xs text-white/40">
          <ArrowUp className="w-3 h-3" />
          <span>{idea.score > 0 ? idea.score.toLocaleString() : '—'}</span>
        </div>
        <button
          onClick={handleSourceClick}
          className="text-xs text-white/35 hover:text-white/70 transition-colors"
        >
          {formatDistanceToNow(idea.publishedAt)}
        </button>
      </div>
    </motion.div>
  )
}
