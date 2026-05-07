"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MasonryGrid from "@/components/MasonryGrid";
import Filters from "@/components/Filters";
import IdeaModal from "@/components/IdeaModal";
import HeaderPets from "@/components/HeaderPets";

const TITLE_COLORS = [
  { color: "#F5E642", shadow: "#ffffff" },
  { color: "#FF6B4A", shadow: "#F5E642" },
  { color: "#00FF94", shadow: "#ffffff" },
  { color: "#38BDF8", shadow: "#7C3AED" },
  { color: "#E879F9", shadow: "#FF6B4A" },
  { color: "#FACC15", shadow: "#FF6B4A" },
  { color: "#ffffff", shadow: "#00FF94" },
  { color: "#F97316", shadow: "#FACC15" },
];

const DEFAULT_FILTERS = {
  sources: [],
  categories: [],
  sort: "top",
  confidence: "all",
  q: "",
};

function buildQuery(filters, page) {
  const params = new URLSearchParams({ page: String(page) });
  if (filters.sources.length) params.set("source", filters.sources.join(","));
  if (filters.categories.length)
    params.set("category", filters.categories.join(","));
  params.set("sort", filters.sort);
  if (filters.confidence !== "all")
    params.set("confidence", filters.confidence);
  if (filters.q) params.set("q", filters.q);
  return `/api/ideas?${params.toString()}`;
}


export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [colorIdx, setColorIdx] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();

  const sentinelRef = useRef(null);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const filtersRef = useRef(filters);

  // Keep refs in sync
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  // Color cycle
  useEffect(() => {
    const id = setInterval(
      () => setColorIdx((i) => (i + 1) % TITLE_COLORS.length),
      1800,
    );
    return () => clearInterval(id);
  }, []);

  // Open modal from ?idea= URL param once ideas are loaded
  useEffect(() => {
    const ideaId = searchParams.get("idea");
    if (!ideaId || loading || ideas.length === 0) return;
    const match = ideas.find((i) => i.id === ideaId);
    if (match) setSelectedIdea(match);
  }, [searchParams, ideas, loading]);

  // Sync modal open/close to URL
  const handleOpenIdea = useCallback((idea) => {
    setSelectedIdea(idea);
    const params = new URLSearchParams(window.location.search);
    params.set("idea", idea.id);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleCloseIdea = useCallback(() => {
    setSelectedIdea(null);
    const params = new URLSearchParams(window.location.search);
    params.delete("idea");
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/", { scroll: false });
  }, [router]);

  // Initial + filter-change load (streaming)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadingMore(false);
      setError(null);
      setIdeas([]);
      setTotal(0);
      setPage(1);
      setHasMore(false);
      pageRef.current = 1;
      hasMoreRef.current = false;

      try {
        const res = await fetch(buildQuery(filters, 1));
        if (!res.ok) throw new Error("Failed to fetch");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let firstChunk = true;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (cancelled) { reader.cancel(); break; }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Keep the last (possibly incomplete) line in the buffer
          buffer = lines.pop();

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const chunk = JSON.parse(line);

              if (chunk.type === "ideas" && !cancelled) {
                setIdeas((prev) => [...prev, ...chunk.ideas]);
                setTotal((prev) => prev + chunk.ideas.length);
                if (firstChunk) {
                  // First source resolved — hide initial spinner, show stream spinner
                  setLoading(false);
                  setLoadingMore(true);
                  firstChunk = false;
                }
              } else if (chunk.type === "done" && !cancelled) {
                // All sources settled — hide stream spinner, show end-of-results
                setLoadingMore(false);
                setHasMore(false);
              }
            } catch {
              // malformed chunk — skip
            }
          }
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  // Load next page — not used during initial streaming; kept for future paginated sources
  const loadMore = useCallback(() => {}, []);

  // IntersectionObserver sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0d0d0d] border-b-2 border-white">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="relative h-16 flex items-center justify-center">
            <div className="flex items-center gap-2 relative z-0 select-none">
              <motion.span
                className="font-black uppercase text-2xl sm:text-3xl"
                animate={{
                  color: TITLE_COLORS[colorIdx].color,
                  textShadow: `3px 3px 0px ${TITLE_COLORS[colorIdx].shadow}`,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.3em",
                }}
              >
                IDEAHUNT
              </motion.span>
            </div>
            <HeaderPets />
          </div>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 flex flex-col gap-5">
        <h1 className="sr-only">IdeaHunt — Startup and product ideas from Reddit, Hacker News, Dev.to and more</h1>
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <Filters filters={filters} onChange={setFilters} total={total} />
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
            >
              Something went wrong: {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Masonry grid */}
        <MasonryGrid
          ideas={ideas}
          loading={loading}
          onCardClick={handleOpenIdea}
        />

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" />

        {/* Load more indicator */}
        {loadingMore && (
          <div className="flex justify-center py-6">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/40"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.15,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* End of results */}
        {!loading && !hasMore && ideas.length > 0 && (
          <p className="text-center text-xs text-white/20 py-4">
            — {total} ideas loaded —
          </p>
        )}
      </main>

      {/* Detail modal */}
      <IdeaModal idea={selectedIdea} onClose={handleCloseIdea} />
    </div>
  );
}
