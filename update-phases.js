// update-phases.js — Restores all 6 sequential UPSC preparation phases
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function run() {
  console.log('Regenerating all 6 preparation phases through 20 August 2027...');

  const topics = await prisma.syllabusTopic.findMany();
  if (topics.length === 0) {
    console.error('No topics found. Run: node seed-full-syllabus.js first.');
    return;
  }

  await prisma.dailyTask.deleteMany({});
  console.log('Cleared existing tasks.');

  const startDate = new Date(); // Late October 2026
  const mainsDate = new Date('2027-08-20T00:00:00.000Z');

  const gsTopics = topics.filter(t => t.paper.startsWith('GS'));
  const psirTopics = topics.filter(t => t.paper.startsWith('PSIR'));

  let currentDate = new Date(startDate);
  let dayNumber = 1;
  let gsIdx = 0;
  let psirIdx = 0;

  const allTasks = [];

  while (currentDate <= mainsDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const assignedGS = gsTopics[gsIdx % gsTopics.length];
    const assignedPSIR = psirTopics[psirIdx % psirTopics.length];

    // Determine exact Phase based on UPSC preparation calendar
    let phase = '';
    let s1Subject = '', s1Title = '', s1Hours = 3.0, s1Source = assignedGS.title;
    let s2Subject = '', s2Title = '', s2Hours = 3.0, s2Source = assignedPSIR.title;
    let s3Subject = '', s3Title = '', s3Hours = 2.0, s3Source = 'PIB & Editorial';

    if (dateStr <= '2026-12-15') {
      // PHASE 1: FOUNDATION & NCERTS
      phase = 'Phase 1: Foundation & NCERTs';
      s1Subject = `GS Foundation (${assignedGS.paper})`;
      s1Title = `NCERT Core Reading & Summary: ${assignedGS.title}`;
      s2Subject = `PSIR Foundation (${assignedPSIR.paper.replace('_', ' ')})`;
      s2Title = `Foundational Political Concepts: ${assignedPSIR.title}`;
      s3Subject = 'Current Affairs & Basic PYQs';
      s3Title = 'Daily Editorial Analysis & Previous 5-Year Question Mapping';
    } else if (dateStr <= '2027-01-31') {
      // PHASE 2: STANDARD BOOKS & CORE SYLLABUS
      phase = 'Phase 2: Standard Books & Core Syllabus';
      s1Subject = `GS Core (${assignedGS.paper})`;
      s1Title = `Standard Reference Study: ${assignedGS.title}`;
      s2Subject = `PSIR Optional (${assignedPSIR.paper.replace('_', ' ')})`;
      s2Title = `Thinker Analysis & Scholar Arguments: ${assignedPSIR.title}`;
      s3Subject = 'Daily Answer Practice';
      s3Title = '1 Timed 10-Marker Descriptive Answer + Editorial Linkage';
    } else if (dateStr <= '2027-02-28') {
      // PHASE 3: INTEGRATED GS + PSIR CONSOLIDATION (BRIDGE PHASE)
      phase = 'Phase 3: Integrated GS + PSIR Consolidation';
      s1Subject = `GS Consolidation (${assignedGS.paper})`;
      s1Title = `Integrated Revision & Cross-linking: ${assignedGS.title}`;
      s2Subject = `PSIR Consolidation (${assignedPSIR.paper.replace('_', ' ')})`;
      s2Title = `Optional Paper 1 & 2 Theory-IR Interlinking: ${assignedPSIR.title}`;
      s3Subject = 'CSAT Diagnostic & Sectional Review';
      s3Title = 'CSAT Diagnostic Tests + Pre-Prelims Error Diary Setup';
    } else if (dateStr <= '2027-05-23') {
      // PHASE 4: PRELIMS MISSION MODE
      phase = 'Phase 4: Prelims Mission Mode';
      s1Hours = 3.5;
      s1Subject = `Prelims Core (${assignedGS.paper})`;
      s1Title = `Static Elimination & Fact Precision: ${assignedGS.title}`;
      s2Hours = 2.5;
      s2Subject = 'CSAT Paper II Drill';
      s2Title = 'Reading Comprehension Speed Drills & Quant Shortcuts';
      s3Hours = 2.0;
      s3Subject = 'Yearly Compilations & Mock Analysis';
      s3Title = 'PT Yearly Compilations & Full-Length Test Diagnosis';
    } else if (dateStr <= '2027-07-31') {
      // PHASE 5: MAINS INTENSIVE ANSWER WRITING
      phase = 'Phase 5: Mains Intensive Answer Writing';
      s1Hours = 3.5;
      s1Subject = `Mains GS Answer Lab (${assignedGS.paper})`;
      s1Title = `Timed 15-Mark Descriptive Writing: ${assignedGS.title}`;
      s2Hours = 3.5;
      s2Subject = `PSIR Answer Lab (${assignedPSIR.paper.replace('_', ' ')})`;
      s2Title = `20-Mark Answer Drafting with Scholar Debates: ${assignedPSIR.title}`;
      s3Hours = 1.0;
      s3Subject = 'Essay Frameworks';
      s3Title = 'Philosophical Essay Outlines & GS-4 Case Studies';
    } else {
      // PHASE 6: FINAL MAINS SIMULATIONS & WEAK AREAS (AUG 1 - AUG 20, 2027)
      phase = 'Phase 6: Final Mains Simulations & Weak Areas';
      s1Hours = 4.0;
      s1Subject = `Mains Simulation (${assignedGS.paper})`;
      s1Title = `3-Hour Full-Length Exam Simulation: ${assignedGS.title}`;
      s2Hours = 3.0;
      s2Subject = `PSIR Final Recall (${assignedPSIR.paper.replace('_', ' ')})`;
      s2Title = `Thinker Quote Bank & Ready Introductions/Conclusions`;
      s3Hours = 1.0;
      s3Subject = 'Ethics & Quotations';
      s3Title = 'Rapid Review of 2nd ARC, Law Commission & Case Laws';
    }

    allTasks.push({
      id: `TASK-${dateStr}-1`,
      topicId: assignedGS.id,
      scheduledDate: dateStr,
      dayNumber,
      phase,
      sessionNumber: 1,
      subject: s1Subject,
      durationHours: s1Hours,
      actionTitle: s1Title,
      stepNotes: 'Focus on high-retention active recall. Extract keywords, articles, and precedents.',
      keyConcepts: 'Analytical Depth, Exam Alignment, Conceptual Clarity',
      expectedOutput: 'Structured notes or evaluated answer',
      primarySource: assignedGS.title,
      status: 'NOT_STARTED'
    });

    allTasks.push({
      id: `TASK-${dateStr}-2`,
      topicId: assignedPSIR.id,
      scheduledDate: dateStr,
      dayNumber,
      phase,
      sessionNumber: 2,
      subject: s2Subject,
      durationHours: s2Hours,
      actionTitle: s2Title,
      stepNotes: 'Contextualize with scholarly arguments and contemporary events.',
      keyConcepts: 'Thinker Debates, Theoretical Depth, Inter-topic Linkages',
      expectedOutput: 'Answer framework or comparative matrix entry',
      primarySource: assignedPSIR.title,
      status: 'NOT_STARTED'
    });

    allTasks.push({
      id: `TASK-${dateStr}-3`,
      topicId: assignedGS.id,
      scheduledDate: dateStr,
      dayNumber,
      phase,
      sessionNumber: 3,
      subject: s3Subject,
      durationHours: s3Hours,
      actionTitle: s3Title,
      stepNotes: 'Review editorial arguments and practice timed application.',
      keyConcepts: 'Time Discipline, Elimination, Current Integration',
      expectedOutput: 'Daily editorial synthesis card',
      primarySource: 'PIB & Verified Sources',
      status: 'NOT_STARTED'
    });

    gsIdx++;
    psirIdx++;
    currentDate.setDate(currentDate.getDate() + 1);
    dayNumber++;
  }

  // Insert in batches of 50
  for (let i = 0; i < allTasks.length; i += 50) {
    const batch = allTasks.slice(i, i + 50);
    await prisma.$transaction(batch.map(t => prisma.dailyTask.create({ data: t })));
  }

  const counts = await prisma.dailyTask.groupBy({
    by: ['phase'],
    _count: { id: true }
  });

  console.log('\n--- VERIFICATION: ALL 6 PHASES POPULATED ---');
  counts.forEach(c => {
    console.log(`  ${c.phase.padEnd(52)} : ${c._count.id} sessions`);
  });
  console.log('--------------------------------------------\n');

  // Update app/page.tsx with all 6 phases in the dropdown filter
  const pagePath = path.join(__dirname, 'app/page.tsx');
  let content = fs.readFileSync(pagePath, 'utf8');

  const oldDropdownRegex = /<select[\s\S]*?value=\{selectedPhaseFilter\}[\s\S]*?<\/select>/;
  const newDropdown = `<select 
                        value={selectedPhaseFilter}
                        onChange={(e) => setSelectedPhaseFilter(e.target.value)}
                        className="border rounded p-1.5 text-xs text-slate-700 bg-white font-medium"
                      >
                        <option value="ALL">All Phases (Full 2026-2027 Roadmap)</option>
                        <option value="Phase 1">Phase 1: Foundation & NCERTs (Late 2026)</option>
                        <option value="Phase 2">Phase 2: Standard Books & Core Syllabus (Jan 2027)</option>
                        <option value="Phase 3">Phase 3: Integrated GS + PSIR Consolidation (Feb 2027)</option>
                        <option value="Phase 4">Phase 4: Prelims Mission Mode (Mar-May 2027)</option>
                        <option value="Phase 5">Phase 5: Mains Intensive Answer Writing (May-Jul 2027)</option>
                        <option value="Phase 6">Phase 6: Final Mains Simulations (Aug 2027)</option>
                      </select>`;

  if (oldDropdownRegex.test(content)) {
    content = content.replace(oldDropdownRegex, newDropdown);
  }

  fs.writeFileSync(pagePath, content, 'utf8');
  console.log('✓ app/page.tsx updated with all 6 phase filter options.');
}

run().catch(console.error).finally(() => prisma.$disconnect());