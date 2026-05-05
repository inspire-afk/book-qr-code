import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Book, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";

export default async function GradePage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade: gradeParam } = await params;
  const gradeInt = parseInt(gradeParam);
  
  const grade = await prisma.grade.findUnique({
    where: { grade: gradeInt },
    include: {
      chapters: {
        orderBy: { chapterNo: "asc" },
      },
    },
  });

  if (!grade) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium">
            <Book className="h-4 w-4" />
            Grade {grade.grade}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text">
            {grade.title}
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl">
            Dive into the world of {grade.title}. Master each chapter through interactive videos, comprehensive notes, and challenging quizzes.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-2xl font-bold">Curriculum Chapters</h2>
            <span className="text-sm text-muted-foreground">{grade.chapters.length} Chapters Available</span>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {grade.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/grade/${grade.grade}/c/${chapter.chapterNo}`}
                className="glass-card group p-8 flex items-center justify-between hover:bg-indigo-50/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {chapter.chapterNo}
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">
                    {chapter.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      Quiz Included
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-2 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
