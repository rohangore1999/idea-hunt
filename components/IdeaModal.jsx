'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CATEGORY_ICONS } from '@/lib/classifier'
import { SOURCE_MAP } from '@/lib/sources'
import { ArrowUp, MessageCircle, ExternalLink, User, Clock, X, Share2, Copy, Check } from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://idea-hunt.rohangore.com'

export default function IdeaModal({ idea, onClose }) {
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareRef = useRef(null)

  // Close share popover on outside click
  useEffect(() => {
    if (!shareOpen) return
    function handleClick(e) {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShareOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [shareOpen])

  if (!idea) return null
  const source = SOURCE_MAP[idea.sourceId]

  const shareUrl = `${BASE_URL}/?idea=${idea.id}`
  const shareText = `💡 ${idea.title}`

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const SHARE_OPTIONS = [
    {
      label: 'Copy link',
      icon: copied ? Check : Copy,
      color: copied ? '#4ADE80' : 'rgba(255,255,255,0.7)',
      action: handleCopy,
    },
    {
      label: 'Twitter / X',
      icon: null,
      color: '#1DA1F2',
      action: () => window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        '_blank', 'noopener,noreferrer'
      ),
    },
    {
      label: 'WhatsApp',
      icon: null,
      color: '#25D366',
      action: () => window.open(
        `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
        '_blank', 'noopener,noreferrer'
      ),
    },
    {
      label: 'LinkedIn',
      icon: null,
      color: '#0A66C2',
      action: () => window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        '_blank', 'noopener,noreferrer'
      ),
    },
  ]

  return (
    <Dialog open={!!idea} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-16px)] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] 2xl:w-[45vw] min-w-0 max-w-none max-h-[90vh] overflow-x-hidden overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden rounded-2xl bg-[#1a1a1a] border border-white/10 text-white [&>*]:min-w-0 [&>*]:w-full"
      >
        <div className="flex flex-col gap-4 min-w-0 w-full overflow-hidden">
          <DialogHeader>
            <div className="flex items-start justify-between gap-2">
              <span
                className="text-[10px] font-bold tracking-widest uppercase mb-1 block"
                style={{ color: source?.color }}
              >
                {source?.shortName}
              </span>
              <button
                onClick={onClose}
                className="shrink-0 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title row with share button */}
            <div className="flex items-start gap-2 min-w-0">
              <DialogTitle className="flex-1 text-base font-bold leading-snug text-white text-left break-words overflow-wrap-anywhere">
                {idea.title}
              </DialogTitle>

              {/* Share button + popover */}
              <div className="relative shrink-0" ref={shareRef}>
                <button
                  onClick={() => setShareOpen(o => !o)}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors"
                  title="Share this idea"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {shareOpen && (
                  <div className="absolute right-0 top-8 z-50 w-44 rounded-xl bg-[#1f1f1f] border border-white/10 shadow-xl overflow-hidden">
                    {SHARE_OPTIONS.map(({ label, icon: Icon, color, action }) => (
                      <button
                        key={label}
                        onClick={() => { action(); if (label !== 'Copy link') setShareOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
                        style={{ color }}
                      >
                        {Icon ? (
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center text-[10px] font-bold rounded-sm"
                            style={{ background: color, color: '#fff' }}>
                            {label[0]}
                          </span>
                        )}
                        <span className="font-medium">{label === 'Copy link' && copied ? 'Copied!' : label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Description */}
          {idea.description && (
            <p className="text-sm text-white/50 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/35">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[140px]">{idea.author}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              {formatDistanceToNow(idea.publishedAt)}
            </span>
            {idea.score > 0 && (
              <span className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3 shrink-0" />
                {idea.score.toLocaleString()} upvotes
              </span>
            )}
            {idea.comments > 0 && (
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3 shrink-0" />
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
