// fix-schedule.js — Generates Complete 298-Day Timetable through Mains 2027
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function run() {
  console.log('Generating complete date-wise plan through 20 August 2027...');

  // 1. Fetch all seeded syllabus topics
  const topics = await prisma.syllabusTopic.findMany();
  if (topics.length === 0) {
    console.error('No topics found. Please run: node seed-full-syllabus.js first.');
    return;
  }

  // 2. Clear old truncated tasks
  await prisma.dailyTask.deleteMany({});
  console.log('Cleared old truncated tasks.');

  // 3. Define Milestones
  const startDate = new Date();
  const prelimsPivot = new Date('2027-03-01T00:00:00.000Z');
  const prelimsDate = new Date('2027-05-23T00:00:00.000Z');
  const mainsDate = new Date('2027-08-20T00:00:00.000Z');

  const gsTopics = topics.filter(t => t.paper.startsWith('GS'));
  const psirTopics = topics.filter(t => t.paper.startsWith('PSIR'));

  let currentDate = new Date(startDate);
  let dayNumber = 1;
  let gsIndex = 0;
  let psirIndex = 0;

  const allTasks = [];

  while (currentDate <= mainsDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const isPrelimsSprint = currentDate >= prelimsPivot && currentDate <= prelimsDate;
    const isMainsSprint = currentDate > prelimsDate;

    const assignedGS = gsTopics[gsIndex % gsTopics.length];
    const assignedPSIR = psirTopics[psirIndex % psirTopics.length];

    if (isMainsSprint) {
      // ================= PHASE 5: MAINS SPRINT (24 May 2027 - 20 Aug 2027) =================
      allTasks.push({
        id: `TASK-${dateStr}-1`,
        topicId: assignedGS.id,
        scheduledDate: dateStr,
        dayNumber,
        phase: 'Phase 5: Mains Sprint (Intensive Answer Writing)',
        sessionNumber: 1,
        subject: `Mains ${assignedGS.paper}: Answer Writing Lab`,
        durationHours: 3.5,
        actionTitle: `Timed 15-Mark Descriptive Answers: ${assignedGS.title}`,
        stepNotes: 'Draft two 250-word answers under strict 18-minute timer. Self-evaluate against 2nd ARC/Law Commission benchmarks.',
        keyConcepts: 'Analytical Depth, Precedents, Forward Looking Conclusion',
        expectedOutput: '2 evaluated Mains answers with criteria scoring',
        primarySource: 'Standard Reference & 2nd ARC',
        status: 'NOT_STARTED'
      });

      allTasks.push({
        id: `TASK-${dateStr}-2`,
        topicId: assignedPSIR.id,
        scheduledDate: dateStr,
        dayNumber,
        phase: 'Phase 5: Mains Sprint (Intensive Answer Writing)',
        sessionNumber: 2,
        subject: `PSIR Optional ${assignedPSIR.paper.replace('_', ' ')}: Consolidation`,
        durationHours: 3.5,
        actionTitle: `Thinker Synthesis & 20-Mark Question: ${assignedPSIR.title}`,
        stepNotes: 'Incorporate scholar debates (Rawls vs Nozick vs Sen or Waltz vs Wendt). Write 1 full 20-marker.',
        keyConcepts: 'Theoretical Rigour, Thinker Cross-linking, Directives',
        expectedOutput: '1 full-length 250-word PSIR answer evaluated',
        primarySource: 'Heywood / Shubhra Ranjan Notes',
        status: 'NOT_STARTED'
      });

      allTasks.push({
        id: `TASK-${dateStr}-3`,
        topicId: assignedGS.id,
        scheduledDate: dateStr,
        dayNumber,
        phase: 'Phase 5: Mains Sprint (Intensive Answer Writing)',
        sessionNumber: 3,
        subject: 'Essay & Ethics Case Studies',
        durationHours: 1.0,
        actionTitle: 'Philosophical Essay Framework / GS-4 Case Study',
        stepNotes: 'Draft PESTLE brainstorm outline for 1 philosophical essay theme or solve 1 ethical dilemma.',
        keyConcepts: 'Stakeholder Matrix, Multi-dimensional Essay Outlining',
        expectedOutput: '1 Essay Outline / Case study structure',
        primarySource: 'Previous 5 Years Mains Papers',
        status: 'NOT_STARTED'
      });
    } else if (isPrelimsSprint) {
      // ================= PHASE 4: PRELIMS MISSION MODE (01 March 2027 - 23 May 2027) =================
      allTasks.push({
        id: `TASK-${dateStr}-1`,
        topicId: assignedGS.id,
        scheduledDate: dateStr,
        dayNumber,
        phase: 'Phase 4: Prelims Mission Mode (High-Yield MCQs)',
        sessionNumber: 1,
        subject: `Prelims Core: ${assignedGS.paper}`,
        durationHours: 3.5,
        actionTitle: `Static Precision & Elimination Drills: ${assignedGS.title}`,
        stepNotes: 'Review high-yield static facts, constitutional articles, and map locations. Solve 35 Prelims MCQs.',
        keyConcepts: 'Option Elimination, Factual Traps, Negative Mark Avoidance',
        expectedOutput: '35 MCQs completed + error analysis diary entry',
        primarySource: 'Standard Reference + NCERT Class 11/12',
        status: 'NOT_STARTED'
      });

      allTasks.push({
        id: `TASK-${dateStr}-2`,
        topicId: assignedGS.id,
        scheduledDate: dateStr,
        dayNumber,
        phase: 'Phase 4: Prelims Mission Mode (High-Yield MCQs)',
        sessionNumber: 2,
        subject: 'CSAT Paper II Drill',
        durationHours: 2.0,
        actionTitle: 'CSAT Speed Drill: Reading Comprehension & Quant Short Cuts',
        stepNotes: 'Attempt 20 Comprehension passages and 15 reasoning problems under 45-minute strict timer.',
        keyConcepts: 'Critical Inference, Assumption Testing, Mental Arithmetic',
        expectedOutput: '35 CSAT questions solved and scored',
        primarySource: 'CSAT Official Papers (2014-2026)',
        status: 'NOT_STARTED'
      });

      allTasks.push({
        id: `TASK-${dateStr}-3`,
        topicId: assignedGS.id,
        scheduledDate: dateStr,
        dayNumber,
        phase: 'Phase 4: Prelims Mission Mode (High-Yield MCQs)',
        sessionNumber: 3,
        subject: 'Current Affairs Revision & Spaced Repetition',
        durationHours: 2.5,
        actionTitle: 'PT Yearly Compilations & Spaced Retrieval',
        stepNotes: 'Consolidate 12-month schemes, species in news, and global summits. Clear active recall queue.',
        keyConcepts: 'Yearly Review, Government Initiatives, Treaties',
        expectedOutput: '1-page micro cheat sheet + flashcard reviews',
        primarySource: 'PIB + Monthly Compilations',
        status: 'NOT_STARTED'
      });
    } else {
      // ================= PHASE 1 & 2: INTEGRATED FOUNDATION (Today - 28 Feb 2027) =================
      const currentPhase = dayNumber <= 45 
        ? 'Phase 1: Foundation & NCERTs' 
        : 'Phase 2: Comprehensive GS + PSIR Completion';

      allTasks.push({
        id: `TASK-${dateStr}-1`,
        topicId: assignedGS.id,
        scheduledDate: dateStr,
        dayNumber,
        phase: currentPhase,
        sessionNumber: 1,
        subject: `GS Foundation: ${assignedGS.paper}`,
        durationHours: 3.0,
        actionTitle: `Conceptual Deep Reading: ${assignedGS.title}`,
        stepNotes: 'Read standard chapters with pencil highlighting. Extract core articles, committee reports, and definitions.',
        keyConcepts: 'Conceptual Foundations, Doctrinal Evolution, Directives',
        expectedOutput: '1-page structured digital or handwritten notes',
        primarySource: 'M. Laxmikanth / Spectrum / GC Leong / Singhania',
        status: 'NOT_STARTED'
      });

      allTasks.push({
        id: `TASK-${dateStr}-2`,
        topicId: assignedPSIR.id,
        scheduledDate: dateStr,
        dayNumber,
        phase: currentPhase,
        sessionNumber: 2,
        subject: `PSIR Optional: ${assignedPSIR.paper.replace('_', ' ')}`,
        durationHours: 3.0,
        actionTitle: `Thinker Debates & Conceptual Rigour: ${assignedPSIR.title}`,
        stepNotes: 'Extract primary thesis and counterarguments of key scholars. Map to contemporary political/IR developments.',
        keyConcepts: 'Deontological vs Utilitarian, Realist vs Liberal, Case Precedents',
        expectedOutput: 'Thinker comparison entry + 1 answer outline',
        primarySource: 'Andrew Heywood / Brian Nelson / O.P. Gauba',
        status: 'NOT_STARTED'
      });

      allTasks.push({
        id: `TASK-${dateStr}-3`,
        topicId: assignedGS.id,
        scheduledDate: dateStr,
        dayNumber,
        phase: currentPhase,
        sessionNumber: 3,
        subject: 'Daily Current Affairs & Practice',
        durationHours: 2.0,
        actionTitle: 'Editorial Synthesis + 1 Timed Mains Answer',
        stepNotes: 'Read PIB and The Hindu. Write 1 timed 10-marker Mains answer on today\'s static topic.',
        keyConcepts: 'Static-Dynamic Linkages, Time Adherence, Word Density',
        expectedOutput: '1 timed answer written + 10 Prelims PYQs solved',
        primarySource: 'The Hindu & PIB Official Releases',
        status: 'NOT_STARTED'
      });
    }

    gsIndex++;
    psirIndex++;
    currentDate.setDate(currentDate.getDate() + 1);
    dayNumber++;
  }

  console.log(`Inserting ${allTasks.length} tasks covering ${dayNumber - 1} days into database...`);

  // Insert in batches of 50 to keep SQLite fast
  for (let i = 0; i < allTasks.length; i += 50) {
    const batch = allTasks.slice(i, i + 50);
    await prisma.$transaction(
      batch.map(t => prisma.dailyTask.create({ data: t }))
    );
  }

  // Count by phase to confirm
  const counts = await prisma.dailyTask.groupBy({
    by: ['phase'],
    _count: { id: true }
  });

  console.log('\n--- VERIFICATION OF SCHEDULED PHASES ---');
  counts.forEach(c => {
    console.log(`  ${c.phase.padEnd(52)} : ${c._count.id} study sessions`);
  });
  console.log('----------------------------------------');
  console.log(`Total scheduled days: ${dayNumber - 1} days (Today through 20 August 2027)`);
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\nSchedule generation complete. Now updating app/page.tsx filters...');
    updateAppPageFilters();
  });

function updateAppPageFilters() {
  const pagePath = path.join(__dirname, 'app/page.tsx');
  let content = fs.readFileSync(pagePath, 'utf8');

  // Ensure dropdown filter supports all 5 phases
  const oldDropdownRegex = /<select[\s\S]*?value=\{selectedPhaseFilter\}[\s\S]*?<\/select>/;
  const newDropdown = `<select 
                        value={selectedPhaseFilter}
                        onChange={(e) => setSelectedPhaseFilter(e.target.value)}
                        className="border rounded p-1.5 text-xs text-slate-700 bg-white font-medium"
                      >
                        <option value="ALL">All Phases (Full 2026-2027 Roadmap)</option>
                        <option value="Phase 1">Phase 1: Foundation & NCERTs</option>
                        <option value="Phase 2">Phase 2: Comprehensive GS + PSIR</option>
                        <option value="Phase 4">Phase 4: Prelims Mission Mode</option>
                        <option value="Phase 5">Phase 5: Mains Sprint (Post-Prelims)</option>
                      </select>`;

  if (oldDropdownRegex.test(content)) {
    content = content.replace(oldDropdownRegex, newDropdown);
  }

  // Ensure table shows up to 200 items when filtered instead of stopping at 50
  content = content.replace(/\.slice\(0,\s*50\)/g, '.slice(0, 300)');

  fs.writeFileSync(pagePath, content, 'utf8');
  console.log('✓ app/page.tsx updated with all phase filters and increased row limits.');
}