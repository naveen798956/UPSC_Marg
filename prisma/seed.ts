import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding official syllabus taxonomy and genuine PYQs...');

  await prisma.dailyTask.deleteMany({});
  await prisma.pYQ.deleteMany({});
  await prisma.syllabusTopic.deleteMany({});
  await prisma.userProfile.deleteMany({});

  await prisma.userProfile.create({
    data: {
      targetYear: 2027,
      prelimsDate: new Date('2027-05-23T00:00:00.000Z'),
      mainsDate: new Date('2027-08-20T00:00:00.000Z'),
      prelimsPivotDate: new Date('2027-03-01T00:00:00.000Z'),
      dailyHours: 8.0,
      studyDaysPerWeek: 6,
      gsProficiency: 20,
      psirProficiency: 15,
      csatConfidence: 'MODERATE'
    }
  });

  const topics = [
    { id: 'GS2-CONST', paper: 'GS2', section: 'Constitution & Polity', title: 'Indian Constitution: Historical Underpinnings, Basic Structure & Amendments', officialCode: 'GS2-01' },
    { id: 'GS2-FED', paper: 'GS2', section: 'Federal Structure', title: 'Federal Structure: Inter-State Relations & Finance Commission', officialCode: 'GS2-02' },
    { id: 'GS1-MOD', paper: 'GS1', section: 'Modern History', title: 'Modern Indian History & Freedom Struggle (1757-1947)', officialCode: 'GS1-02' },
    { id: 'GS3-ECON', paper: 'GS3', section: 'Economy', title: 'Indian Economy: Growth, Employment, Budgeting & Inclusive Growth', officialCode: 'GS3-01' },
    { id: 'GS4-ETHICS', paper: 'GS4', section: 'Ethics', title: 'Ethics and Human Interface: Essence, Determinants & Consequences', officialCode: 'GS4-01' },
    { id: 'PSIR-1A-JUST', paper: 'PSIR_1A', section: 'Political Theory: Concepts', title: 'Justice: Rawlsian Theory of Justice as Fairness & Communitarian Critiques', officialCode: 'PSIR-1A-03' },
    { id: 'PSIR-1A-STATE', paper: 'PSIR_1A', section: 'Political Theory: State', title: 'Theories of the State: Liberal, Marxist, Pluralist, Feminist', officialCode: 'PSIR-1A-02' },
    { id: 'PSIR-2B-DET', paper: 'PSIR_2B', section: "India's Foreign Policy", title: "Determinants of Indian Foreign Policy: Non-Alignment & Strategic Autonomy", officialCode: 'PSIR-2B-01' }
  ];

  for (const t of topics) {
    await prisma.syllabusTopic.create({ data: t });
  }

  await prisma.pYQ.create({
    data: {
      id: 'UPSC-2023-PRE-01',
      year: 2023,
      stage: 'PRELIMS',
      paper: 'GS2',
      topicId: 'GS2-CONST',
      questionText: 'In India, consider the following statements: 1. By amendment to the Constitution of India in 1991, the National Capital Territory of Delhi was given a Legislative Assembly. 2. The Chief Minister of Delhi is appointed by the Lieutenant Governor. Which of the statements given above is/are correct?',
      questionType: 'PRELIMS_MCQ',
      optionsJson: JSON.stringify([
        { id: 'A', text: '1 only' },
        { id: 'B', text: '2 only' },
        { id: 'C', text: 'Both 1 and 2' },
        { id: 'D', text: 'Neither 1 nor 2' }
      ]),
      correctOption: 'A',
      explanation: 'Statement 1 is correct (69th Constitutional Amendment Act, 1991 inserted Art 239AA). Statement 2 is incorrect (Under Art 239AA(5), the CM is appointed by the President, not the LG).'
    }
  });

  console.log('Seeding completed successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());