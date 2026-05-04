"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  if (filters.sort !== "top") params.set("sort", filters.sort);
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

  // Initial + filter-change load
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setIdeas([]);
      setPage(1);
      setHasMore(true);
      pageRef.current = 1;
      hasMoreRef.current = true;

      try {
        const res = await fetch(buildQuery(filters, 1));
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) {
          setIdeas(data.ideas || []);
          setTotal(data.total || 0);
          setHasMore(data.hasMore ?? false);
          setPage(2);
          pageRef.current = 2;
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  // Load next page
  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const res = await fetch(buildQuery(filtersRef.current, pageRef.current));
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setIdeas((prev) => [...prev, ...(data.ideas || [])]);
      setHasMore(data.hasMore ?? false);
      setPage((p) => p + 1);
      pageRef.current += 1;
      hasMoreRef.current = data.hasMore ?? false;
    } catch (e) {
      console.error("loadMore error", e);
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, []);

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
          onCardClick={setSelectedIdea}
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
      <IdeaModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
    </div>
  );
}
