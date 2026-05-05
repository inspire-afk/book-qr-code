"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGrade(formData: FormData) {
  const grade = parseInt(formData.get("grade") as string);
  const title = formData.get("title") as string;

  await prisma.grade.create({
    data: { grade, title },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createChapter(gradeId: string, formData: FormData, quizData: any) {
  const chapterNo = parseInt(formData.get("chapterNo") as string);
  const title = formData.get("title") as string;
  const videoUrl = formData.get("videoUrl") as string || null;
  const pdfUrl = formData.get("pdfUrl") as string || null;

  await prisma.chapter.create({
    data: {
      gradeId,
      chapterNo,
      title,
      videoUrl,
      pdfUrl,
      quiz: {
        create: {
          title: quizData.title,
          totalQuestions: quizData.totalQuestions,
          questions: {
            create: quizData.questions.map((q: any) => ({
              question: q.question,
              options: q.options, // Storing as JSON
              correctAnswer: q.correctAnswer,
              hint: q.hint || null,
            })),
          },
        },
      },
    },
  });

  revalidatePath(`/admin/grade/${gradeId}`);
  revalidatePath(`/grade`);
}

export async function deleteChapter(chapterId: string, gradeId: string) {
  // First delete questions and quiz
  const quiz = await prisma.quiz.findUnique({ where: { chapterId } });
  if (quiz) {
    await prisma.question.deleteMany({ where: { quizId: quiz.id } });
    await prisma.quiz.delete({ where: { id: quiz.id } });
  }
  await prisma.chapter.delete({ where: { id: chapterId } });

  revalidatePath(`/admin/grade/${gradeId}`);
}
