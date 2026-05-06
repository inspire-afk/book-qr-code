"use client"

import { PlayCircle, FileText, ExternalLink, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"

interface MediaViewerProps {
  videoUrl?: string | null
  pdfUrl?: string | null
}

export const MediaViewer = ({ videoUrl, pdfUrl }: MediaViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  const toggleFullscreen = () => {
    const el = document.getElementById("video-container")
    if (!document.fullscreenElement) {
      if (el?.requestFullscreen) el.requestFullscreen()
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setHasStarted(false)
      }
    }
  }

  if (!videoUrl && !pdfUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 text-white/30">
        <FileText className="h-16 w-16 opacity-20" />
        <p>No content available for this chapter yet.</p>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden bg-black shadow-2xl">
      {/* Aspect Ratio Wrapper */}
      <div className="relative h-0 w-full pb-[56.25%]">
        {videoUrl ? (
          <div
            id="video-container"
            className={`group/video absolute inset-0 h-full w-full overflow-hidden bg-black ${isFullscreen ? "z-[9999]" : ""}`}
          >
            <iframe
              src={`${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=${hasStarted ? 1 : 0}`}
              className={`absolute inset-0 h-full w-full border-0 ${isFullscreen ? "h-screen w-screen" : ""}`}
              allow="autoplay; fullscreen"
              allowFullScreen
            />

            {/* First Click Overlay for Mobile */}
            {!hasStarted && !isFullscreen && (
              <div
                className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/40 transition-colors hover:bg-black/20 md:hidden"
                onClick={() => {
                  setHasStarted(true)
                  toggleFullscreen()
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-indigo-600 p-6 text-white shadow-2xl transition-transform hover:scale-110 active:scale-95">
                    <PlayCircle className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-white uppercase drop-shadow-lg">
                    Tap to Play Fullscreen
                  </span>
                </div>
              </div>
            )}

            {/* Indicator Overlay (hidden in fullscreen) */}
            {!isFullscreen && (
              <div className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-bold text-white/70 backdrop-blur-md md:gap-2 md:px-3 md:py-1.5 md:text-xs">
                <PlayCircle className="h-3 w-3 text-indigo-400 md:h-3.5 md:w-3.5" />
                VIDEO LESSON
              </div>
            )}

            {/* Fullscreen Controls */}
            {isFullscreen && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFullscreen()
                }}
                className="absolute top-6 left-6 z-[10000] flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-xl transition-all hover:bg-white/20"
              >
                <RotateCcw className="h-5 w-5" />
                Exit Fullscreen
              </button>
            )}

            {/* Mobile Play Hint Overlay */}
            {!isFullscreen && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover/video:opacity-100 md:hidden">
                <div className="scale-75 rounded-full bg-indigo-600 p-4 text-white shadow-2xl transition-transform group-active/video:scale-90">
                  <PlayCircle className="h-8 w-8" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 h-full w-full">
            <iframe src={pdfUrl!} className="h-full w-full border-0" />
            <div className="group absolute right-6 bottom-6">
              <a
                href={pdfUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-2xl transition-all hover:scale-105 hover:bg-indigo-500 active:scale-95"
              >
                <ExternalLink className="h-4 w-4" />
                Fullscreen PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
