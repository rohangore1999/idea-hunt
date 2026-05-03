'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CATEGORY_ICONS } from '@/lib/classifier'
import { SOURCE_MAP } from '@/lib/sources'
import { ArrowUp, MessageCircle, ExternalLink, User, Clock } from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils'

export default function IdeaModal({ idea, onClose }) {
  if (!idea) return null
  const source = SOURCE_MAP[idea.sourceId]

  return (
    <Dialog open={!!idea} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] 2xl:w-[45vw] max-w-none max-h-[90vh] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden rounded-2xl bg-[#1a1a1a] border border-white/10 text-white"
      >
        <DialogHeader>
          {/* Source label */}
          <span
            className="text-[10px] font-bold tracking-widest uppercase mb-1 block"
            style={{ color: source?.color }}
          >
            {source?.shortName}
          </span>

          <DialogTitle className="text-base font-bold leading-snug text-white text-left">
            {idea.title}
          </DialogTitle>
        </DialogHeader>

        {/* Description */}
        {idea.description && (
          <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
            {idea.description}
          </p>
        )}

        <Separator className="bg-white/8" />

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/8 text-white/60 uppercase tracking-wide">
            {CATEGORY_ICONS[idea.category]} {idea.category}
          </span>
          {idea.secondary?.map(cat => (
            <span key={cat} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 text-white/35 uppercase tracking-wide">
              {cat}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/35">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {idea.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(idea.publishedAt)}
          </span>
          {idea.score > 0 && (
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              {idea.score.toLocaleString()} upvotes
            </span>
          )}
          {idea.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {idea.comments} comments
            </span>
          )}
        </div>

        <Separator className="bg-white/8" />

        {/* CTA */}
        <Button
          className="w-full rounded-xl bg-white text-black hover:bg-white/90 font-semibold"
          onClick={() => window.open(idea.sourceUrl, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Original Post
        </Button>
      </DialogContent>
    </Dialog>
  )
}
