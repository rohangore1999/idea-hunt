"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOURCES } from "@/lib/sources";
import { ALL_CATEGORIES, CATEGORY_ICONS } from "@/lib/classifier";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function Filters({ filters, onChange, total }) {
  const [showCategories, setShowCategories] = useState(false);

  const toggleSource = (id) => {
    const current = filters.sources;
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    onChange({ ...filters, sources: next });
  };

  const toggleCategory = (cat) => {
    const current = filters.categories;
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    onChange({ ...filters, categories: next });
  };

  const hasActiveFilters =
    filters.sources.length > 0 ||
    filters.categories.length > 0 ||
    filters.q ||
    filters.confidence === "hide-low";

  const reset = () =>
    onChange({
      sources: [],
      categories: [],
      sort: "top",
      confidence: "all",
      q: "",
    });

  return (
    <div className="flex flex-col gap-4">
      {/* Search + sort row */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={filters.q}
            onChange={(e) => onChange({ ...filters, q: e.target.value })}
            className="w-full h-9 pl-8 pr-3 text-sm rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>

        <Select
          value={filters.sort}
          onValueChange={(v) => onChange({ ...filters, sort: v })}
        >
          <SelectTrigger
            className="w-36 min-h-0 py-0 rounded-lg text-sm bg-white/5 border-white/10 text-white/70"
            style={{ height: "36px" }}
          >
            <SelectValue>
              {{ latest: "Latest", top: "Most Upvoted", comments: "Most Comments" }[filters.sort]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="top">Most Upvoted</SelectItem>
            <SelectItem value="comments">Most Comments</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={() => setShowCategories((v) => !v)}
          className={`flex items-center gap-1.5 text-xs h-9 px-3 rounded-lg border transition-colors ${
            showCategories || filters.categories.length > 0
              ? "border-white/30 text-white bg-white/10"
              : "border-white/10 text-white/50 bg-white/5 hover:border-white/20"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Categories
          {filters.categories.length > 0 && (
            <span className="bg-white/20 text-white text-[10px] rounded-full px-1.5 py-0 font-bold">
              {filters.categories.length}
            </span>
          )}
        </button>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              onClick={reset}
              className="flex items-center gap-1 text-xs text-white/35 hover:text-white/70 transition-colors px-2 py-1"
            >
              <X className="w-3 h-3" />
              Reset
            </motion.button>
          )}
        </AnimatePresence>

        <span className="text-xs text-white/25 ml-auto tabular-nums">
          {total} ideas
        </span>
      </div>

      {/* Source filters */}
      <div className="flex flex-wrap gap-2">
        {SOURCES.map((source, i) => {
          const active = filters.sources.includes(source.id);
          return (
            <motion.button
              key={source.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSource(source.id)}
              className="text-[11px] font-bold tracking-wider uppercase px-3 rounded-lg border transition-colors duration-150"
              style={{
                height: "36px",
                ...(active
                  ? {
                      color: source.color,
                      backgroundColor: source.bgColor,
                      borderColor: `${source.color}40`,
                    }
                  : {
                      color: "rgba(255,255,255,0.35)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }),
              }}
            >
              {source.shortName}
            </motion.button>
          );
        })}
      </div>

      {/* Category filters (collapsible) */}
      <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ALL_CATEGORIES.map((cat, i) => {
                const active = filters.categories.includes(cat);
                return (
                  <motion.button
                    key={cat}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.015, duration: 0.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCategory(cat)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors duration-150 font-medium ${
                      active
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white/45 border-white/8 hover:border-white/20 hover:text-white/70"
                    }`}
                  >
                    {CATEGORY_ICONS[cat]} {cat}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
