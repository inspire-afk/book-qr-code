import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, FileVideo, FileText, Trash2 } from "lucide-react";
import { ChapterForm } from "../../ChapterForm";
import { DeleteChapterButton } from "../../DeleteChapterButton";
import { GenerateQRButton } from "../../GenerateQRButton";

export default async function GradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const grade = await prisma.grade.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { chapterNo: "asc" },
      },
    },
  });

  if (!grade) return notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <Link 
              href="/admin"
              className="text-white/40 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="space-y-1">
              <h1 className="text-4xl font-bold gradient-text">Grade {grade.grade} Content</h1>
              <p className="text-white/40">{grade.title}</p>
            </div>
          </div>
          
          <ChapterForm gradeId={grade.id} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Chapters List
            <span className="bg-indigo-600/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full border border-indigo-500/30">
              {grade.chapters.length}
            </span>
          </h2>

          <div className="grid gap-4">
            {grade.chapters.map((chapter) => (
              <div key={chapter.id} className="glass-card flex items-center justify-between p-6 group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {chapter.chapterNo}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{chapter.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      {chapter.videoUrl && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                          <FileVideo className="h-3.5 w-3.5" />
                          Video
                        </span>
                      )}
                      {chapter.pdfUrl && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider">
                          <FileText className="h-3.5 w-3.5" />
                          PDF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <GenerateQRButton 
                    path={`/grade/${grade.grade}/c/${chapter.chapterNo}`} 
                    fileName={`Grade-${grade.grade}-Ch-${chapter.chapterNo}`}
                  />
                  <DeleteChapterButton chapterId={chapter.id} gradeId={grade.id} />
                </div>
              </div>
            ))}

            {grade.chapters.length === 0 && (
              <div className="py-20 text-center glass-card border-dashed border-white/10 bg-transparent">
                <p className="text-white/20 italic">No chapters created for this grade yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
