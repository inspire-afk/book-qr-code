"use client";

import { PlayCircle, FileText, ExternalLink } from "lucide-react";

interface MediaViewerProps {
  videoUrl?: string | null;
  pdfUrl?: string | null;
}

export const MediaViewer = ({ videoUrl, pdfUrl }: MediaViewerProps) => {
  if (!videoUrl && !pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
        <FileText className="h-16 w-16 opacity-20" />
        <p>No content available for this chapter yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/40 relative">
      {/* Indicator Overlay */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs font-bold text-white/70 pointer-events-none">
        {videoUrl ? (
          <>
            <PlayCircle className="h-3.5 w-3.5 text-indigo-400" />
            VIDEO LESSON
          </>
        ) : (
          <>
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            PDF NOTES
          </>
        )}
      </div>

      <div className="flex-1">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full">
            <iframe
              src={pdfUrl!}
              className="w-full h-full border-0"
            />
            <div className="absolute bottom-6 right-6 group">
              <a 
                href={pdfUrl!} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                <ExternalLink className="h-4 w-4" />
                Fullscreen PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
