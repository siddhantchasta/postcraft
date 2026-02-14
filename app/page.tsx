"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Zap,
  PenTool,
  ChevronDown,
} from "lucide-react";

const VOICE_OPTIONS = [
  {
    value: "contrarian",
    label: "Contrarian",
    description: "Challenge norms",
    color: "from-red-500 to-orange-500",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    ring: "ring-red-500/20",
  },
  {
    value: "authoritative",
    label: "Authoritative",
    description: "Lead with data",
    color: "from-violet-500 to-indigo-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    ring: "ring-violet-500/20",
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm & personal",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    ring: "ring-emerald-500/20",
  },
  {
    value: "humorous",
    label: "Humorous",
    description: "Wit & charm",
    color: "from-amber-500 to-yellow-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    ring: "ring-amber-500/20",
  },
  {
    value: "inspirational",
    label: "Inspirational",
    description: "Uplift & move",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
    ring: "ring-pink-500/20",
  },
  {
    value: "storytelling",
    label: "Storytelling",
    description: "Narrative arc",
    color: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    ring: "ring-cyan-500/20",
  },
];

const LENGTH_OPTIONS = [
  { value: "short", label: "Brief", words: "50-80w", bars: 1 },
  { value: "medium", label: "Standard", words: "100-150w", bars: 2 },
  { value: "long", label: "In-depth", words: "200-280w", bars: 3 },
];

const AUDIENCE_SUGGESTIONS = [
  "Software Engineers",
  "Product Managers",
  "Startup Founders",
  "Marketing Pros",
  "HR Leaders",
  "Sales Teams",
  "Data Scientists",
  "Designers",
];

export default function Home() {
  const [voice, setVoice] = useState("friendly");
  const [audience, setAudience] = useState("");
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("medium");
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const [audienceFocused, setAudienceFocused] = useState(false);

  const { completion, complete, isLoading, error, setCompletion } =
    useCompletion({
      api: "/api/generate",
      streamProtocol: "text",
    });

  useEffect(() => {
    if (completion && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [completion]);

  const handleGenerate = useCallback(async () => {
    if (!audience.trim() || !topic.trim()) return;
    await complete("", {
      body: { voice, audience: audience.trim(), topic: topic.trim(), length },
    });
  }, [voice, audience, topic, length, complete]);

  const handleCopy = useCallback(async () => {
    if (!completion) return;
    await navigator.clipboard.writeText(completion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [completion]);

  const handleReset = useCallback(() => {
    setCompletion("");
  }, [setCompletion]);

  const canGenerate = audience.trim() && topic.trim() && !isLoading;
  const selectedVoice = VOICE_OPTIONS.find((v) => v.value === voice)!;

  return (
    <div className="min-h-screen bg-[#FAF9F7] relative overflow-x-hidden">
      {/* Subtle background texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-0">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Decorative blobs */}
      <div className="fixed top-[-20%] right-[-10%] w-150 h-150 rounded-full bg-linear-to-br from-violet-200/20 to-pink-200/20 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-125 h-125 rounded-full bg-linear-to-tr from-amber-200/20 to-emerald-200/20 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 sm:px-10 pt-8 pb-6 sm:pt-12 sm:pb-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-lg">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-linear-to-r from-emerald-400 to-emerald-500 border-2 border-[#FAF9F7]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                PostCraft
              </h1>
              <p className="text-[13px] text-slate-500 tracking-wide mt-0.5">
                LinkedIn posts that actually get read
              </p>
            </div>
          </div>
        </header>

        <main className="px-6 sm:px-10 pb-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-8 xl:gap-12 items-start">
            {/* Left column: Form */}
            <div className="space-y-8">
              {/* Voice */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                    1
                  </span>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    Pick your voice
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {VOICE_OPTIONS.map((opt) => {
                    const isSelected = voice === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        onClick={() => setVoice(opt.value)}
                        whileTap={{ scale: 0.97 }}
                        className={`group relative rounded-2xl border-2 p-4 text-left transition-all duration-300 cursor-pointer
                          ${
                            isSelected
                              ? `${opt.border} ${opt.bg} ring-4 ${opt.ring}`
                              : "border-transparent bg-white hover:bg-slate-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                          }`}
                      >
                        <div
                          className={`w-8 h-1.5 rounded-full bg-linear-to-r ${opt.color} mb-3 transition-all ${
                            isSelected ? "w-12" : "group-hover:w-10"
                          }`}
                        />
                        <span
                          className={`block text-sm font-semibold mb-0.5 ${
                            isSelected ? opt.text : "text-slate-800"
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="block text-[12px] text-slate-500">
                          {opt.description}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </section>

              {/* Audience */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                    2
                  </span>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    Who are you writing for?
                  </h2>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    onFocus={() => setAudienceFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setAudienceFocused(false), 150)
                    }
                    placeholder="Type a role or pick below..."
                    className="w-full bg-white rounded-xl border-2 border-transparent px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus:outline-none focus:border-slate-300 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.03)] transition-all"
                  />
                  {audience && (
                    <button
                      onClick={() => setAudience("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <span className="sr-only">Clear</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M12 4L4 12M4 4l8 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <AnimatePresence>
                  {(audienceFocused || !audience) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 mt-3">
                        {AUDIENCE_SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setAudience(s);
                              setAudienceFocused(false);
                            }}
                            className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all cursor-pointer
                              ${
                                audience === s
                                  ? "bg-slate-900 text-white"
                                  : "bg-white text-slate-600 hover:bg-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                              }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Topic */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                    3
                  </span>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    What&apos;s the topic?
                  </h2>
                </div>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Describe the topic, trend, or idea you want to write about..."
                  rows={4}
                  className="w-full bg-white rounded-xl border-2 border-transparent px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus:outline-none focus:border-slate-300 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.03)] transition-all resize-none leading-relaxed"
                />
              </section>

              {/* Length */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                    4
                  </span>
                  <h2 className="text-[15px] font-semibold text-slate-800">
                    How long?
                  </h2>
                </div>
                <div className="flex gap-3">
                  {LENGTH_OPTIONS.map((opt) => {
                    const isSelected = length === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setLength(opt.value)}
                        className={`flex-1 rounded-xl border-2 px-4 py-3 text-center transition-all duration-300 cursor-pointer
                          ${
                            isSelected
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-transparent bg-white text-slate-700 hover:bg-slate-50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                          }`}
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {Array.from({ length: opt.bars }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-0.75 rounded-full ${
                                isSelected ? "bg-white/60" : "bg-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="block text-[13px] font-semibold">
                          {opt.label}
                        </span>
                        <span
                          className={`block text-[11px] mt-0.5 ${
                            isSelected ? "text-white/60" : "text-slate-400"
                          }`}
                        >
                          {opt.words}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Generate Button */}
              <motion.button
                onClick={handleGenerate}
                disabled={!canGenerate}
                whileHover={canGenerate ? { scale: 1.01 } : {}}
                whileTap={canGenerate ? { scale: 0.98 } : {}}
                className={`w-full relative group rounded-2xl px-6 py-4 font-semibold text-[15px] transition-all duration-300 cursor-pointer flex items-center justify-center gap-3
                  ${
                    canGenerate
                      ? "bg-slate-900 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
              >
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-white"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-white"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.4,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-white"
                      />
                    </div>
                    <span>Writing your post...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate Post</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </motion.button>
            </div>

            {/* Right column: Output */}
            <div className="xl:sticky xl:top-8 xl:self-start">
              <div className="rounded-3xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100">
                {/* Mock LinkedIn header */}
                <div className="bg-linear-to-r from-slate-900 to-slate-800 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#0A66C2]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span className="text-white/90 text-sm font-medium">
                        Post Preview
                      </span>
                    </div>
                    {completion && !isLoading && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleReset}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Clear</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post body */}
                <div
                  ref={outputRef}
                  className="p-6 min-h-105 max-h-150 overflow-y-auto flex flex-col"
                >
                  <AnimatePresence mode="wait">
                    {error ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center gap-4"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-red-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-800">
                            Generation failed
                          </p>
                          <p className="text-[13px] text-slate-500 mt-1 max-w-65">
                            Check your API key or try again.
                          </p>
                        </div>
                        <button
                          onClick={handleGenerate}
                          className="mt-1 px-4 py-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          Retry
                        </button>
                      </motion.div>
                    ) : completion ? (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1"
                      >
                        {/* Author row */}
                        <div className="flex items-start gap-3 mb-5">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                            Y
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold text-slate-900">
                              Your Name
                            </p>
                            <p className="text-[12px] text-slate-500 leading-snug">
                              Your headline goes here
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                              Just now &middot;
                              <svg
                                className="w-3 h-3"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                              >
                                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5V8a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4.5A.5.5 0 0 1 8 4z" />
                              </svg>
                            </p>
                          </div>
                        </div>

                        {/* Post text */}
                        <div className="text-[14px] leading-[1.65] text-slate-800 whitespace-pre-line selection:bg-blue-100">
                          {completion}
                          {isLoading && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="inline-block w-0.5 h-4.5 bg-slate-900 ml-0.5 align-text-bottom rounded-full"
                            />
                          )}
                        </div>

                        {/* Post footer */}
                        {!isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="flex items-center gap-2 mt-5 mb-3">
                              <div className="flex -space-x-1">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-[10px]">
                                  👍
                                </span>
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-[10px]">
                                  ❤️
                                </span>
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-[10px]">
                                  👏
                                </span>
                              </div>
                              <span className="text-[12px] text-slate-500">
                                You and 42 others
                              </span>
                            </div>
                            <div className="border-t border-slate-100 pt-3 flex items-center justify-around">
                              {[
                                { icon: "👍", label: "Like" },
                                { icon: "💬", label: "Comment" },
                                { icon: "🔄", label: "Repost" },
                                { icon: "📨", label: "Send" },
                              ].map((action) => (
                                <span
                                  key={action.label}
                                  className="flex items-center gap-1.5 text-[13px] text-slate-500 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors cursor-default"
                                >
                                  <span>{action.icon}</span>
                                  <span className="hidden sm:inline">
                                    {action.label}
                                  </span>
                                </span>
                              ))}
                            </div>

                            {/* Meta info */}
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${selectedVoice.bg} ${selectedVoice.text}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${selectedVoice.color}`}
                                  />
                                  {selectedVoice.label}
                                </span>
                                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                                  <span>
                                    {completion.split(/\s+/).filter(Boolean).length} words
                                  </span>
                                  <span>
                                    {completion.length} characters
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Regenerate
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center gap-5"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-slate-900"
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-[14px] font-semibold text-slate-800">
                            Crafting your post
                          </p>
                          <p className="text-[12px] text-slate-500 mt-1">
                            {selectedVoice.label} voice &middot; for{" "}
                            {audience || "your audience"}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center gap-5 py-10"
                      >
                        <div className="relative">
                          <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center">
                            <PenTool className="w-8 h-8 text-slate-300" />
                          </div>
                          <motion.div
                            animate={{ y: [-2, 2, -2] }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-linear-to-br from-amber-100 to-amber-200 border border-amber-200/60 flex items-center justify-center"
                          >
                            <Zap className="w-4 h-4 text-amber-600" />
                          </motion.div>
                        </div>
                        <div className="text-center">
                          <p className="text-[15px] font-semibold text-slate-700">
                            Your post preview
                          </p>
                          <p className="text-[13px] text-slate-400 mt-1.5 max-w-62.5 leading-relaxed">
                            Fill in the details on the left and hit generate to
                            see your post come to life
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Scroll down on mobile</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
