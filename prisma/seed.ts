import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.grade.deleteMany();

  // Create Grade 8
  const grade8 = await prisma.grade.create({
    data: {
      grade: 8,
      title: "Science & Technology",
      chapters: {
        create: [
          {
            chapterNo: 1,
            title: "Microorganisms: Friend and Foe",
            videoUrls: ["https://drive.google.com/file/d/1X5_K8R8Wk5z1h9jW-qZ0b2v3n4m5l6k7/preview"],
            pdfUrls: ["https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"],
            quiz: {
              create: {
                title: "Microorganisms Quiz",
                totalQuestions: 3,
                questions: {
                  create: [
                    {
                      question: "Which of the following is a microorganism?",
                      options: ["Bacteria", "Cow", "Tree", "Stone"],
                      correctAnswer: "Bacteria",
                      hint: "They are invisible to the naked eye."
                    },
                    {
                      question: "Yeast is used in the production of:",
                      options: ["Sugar", "Alcohol", "Hydrochloric acid", "Oxygen"],
                      correctAnswer: "Alcohol",
                      hint: "It involves fermentation."
                    },
                    {
                      question: "The process of conversion of sugar into alcohol is called:",
                      options: ["Nitrogen fixation", "Moulding", "Fermentation", "Infection"],
                      correctAnswer: "Fermentation",
                      hint: "Louis Pasteur discovered it."
                    }
                  ]
                }
              }
            }
          },
          {
            chapterNo: 2,
            title: "Synthetic Fibres and Plastics",
            videoUrls: ["https://drive.google.com/file/d/1Y6_L9S9Xl6z2j0kX-rA1c3w4o5n6m7l8/preview"],
            pdfUrls: ["https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"],
            quiz: {
              create: {
                title: "Fibres Quiz",
                totalQuestions: 2,
                questions: {
                  create: [
                    {
                      question: "Rayon is different from synthetic fibres because:",
                      options: ["It has a silk-like appearance", "It is obtained from wood pulp", "Its fibres can also be woven like those of natural fibres", "It is very durable"],
                      correctAnswer: "It is obtained from wood pulp",
                      hint: "It is also known as artificial silk."
                    },
                    {
                      question: "Which of the following is a thermoplastic?",
                      options: ["Bakelite", "Melamine", "PVC", "None of these"],
                      correctAnswer: "PVC",
                      hint: "It can be softened on heating."
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
