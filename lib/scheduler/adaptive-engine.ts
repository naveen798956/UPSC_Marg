export interface ScheduleConfig {
  prelimsDate: string;
  mainsDate: string;
  prelimsPivotDate: string;
  dailyHours: number;
}

export function generateInitialSchedule(config: ScheduleConfig, topics: any[]) {
  const tasks = [];
  const start = new Date();
  const prelims = new Date(config.prelimsDate);
  const mains = new Date(config.mainsDate);
  const pivot = new Date(config.prelimsPivotDate);

  let current = new Date(start);
  let day = 1;
  let topicIdx = 0;

  while (current <= mains && day <= 300) {
    const dateStr = current.toISOString().split('T')[0];
    const isPrelims = current >= pivot && current <= prelims;
    const isMains = current > prelims;

    const topic = topics[topicIdx % topics.length] || {
      id: 'GS2-CONST',
      title: 'Constitution & Basic Structure',
      paper: 'GS2'
    };

    if (isPrelims) {
      tasks.push({
        id: 'TASK-' + dateStr + '-1',
        topicId: topic.id,
        scheduledDate: dateStr,
        dayNumber: day,
        phase: 'Phase 4: Prelims Mission Mode',
        sessionNumber: 1,
        subject: 'Prelims GS-1 Core',
        durationHours: 3.5,
        actionTitle: 'High-Yield Precision & Traps: ' + topic.title,
        stepNotes: 'Review constitutional articles and maps. Solve 30 MCQs under strict timer.',
        keyConcepts: 'Factual Precision, Elimination Technique',
        expectedOutput: '30 MCQs completed + error log',
        primarySource: 'Standard Source + NCERT',
        status: 'NOT_STARTED'
      });
      tasks.push({
        id: 'TASK-' + dateStr + '-2',
        topicId: topic.id,
        scheduledDate: dateStr,
        dayNumber: day,
        phase: 'Phase 4: Prelims Mission Mode',
        sessionNumber: 2,
        subject: 'CSAT Paper II Drill',
        durationHours: 2.0,
        actionTitle: 'Reading Comprehension & Quant Speed Run',
        stepNotes: 'Solve 20 Comprehension passages and 15 reasoning problems.',
        keyConcepts: 'Inference, Assumption Testing',
        expectedOutput: '35 CSAT items evaluated',
        primarySource: 'CSAT Official Papers (2014-2026)',
        status: 'NOT_STARTED'
      });
    } else if (isMains) {
      tasks.push({
        id: 'TASK-' + dateStr + '-1',
        topicId: topic.id,
        scheduledDate: dateStr,
        dayNumber: day,
        phase: 'Phase 5: Mains Sprint',
        sessionNumber: 1,
        subject: 'Mains GS Paper Mastery',
        durationHours: 4.0,
        actionTitle: 'Timed Mains Answer Writing: ' + topic.title,
        stepNotes: 'Write two 15-mark answers in 18 minutes. Self-evaluate against rubric.',
        keyConcepts: '2nd ARC Recommendations, Case Laws, Forward Synthesis',
        expectedOutput: '2 structured answers evaluated',
        primarySource: 'Mains Standard Reference',
        status: 'NOT_STARTED'
      });
    } else {
      tasks.push({
        id: 'TASK-' + dateStr + '-1',
        topicId: topic.id,
        scheduledDate: dateStr,
        dayNumber: day,
        phase: 'Phase 2: Comprehensive GS + PSIR',
        sessionNumber: 1,
        subject: 'GS Core Foundation',
        durationHours: 3.0,
        actionTitle: 'Deep Conceptual Reading: ' + topic.title,
        stepNotes: 'Read standard chapters with highlighting. Extract core arguments.',
        keyConcepts: 'Constitutional Articles, Doctrinal Evolution',
        expectedOutput: '1-page synthesis note',
        primarySource: 'M. Laxmikanth / Spectrum / Singhania',
        status: 'NOT_STARTED'
      });
      tasks.push({
        id: 'TASK-' + dateStr + '-2',
        topicId: 'PSIR-1A-JUST',
        scheduledDate: dateStr,
        dayNumber: day,
        phase: 'Phase 2: Comprehensive GS + PSIR',
        sessionNumber: 2,
        subject: 'PSIR Optional Deep Dive',
        durationHours: 3.0,
        actionTitle: 'Political Theory: Thinker Debates',
        stepNotes: 'Study Rawlsian justice as fairness and communitarian critiques.',
        keyConcepts: 'Veil of Ignorance, Difference Principle',
        expectedOutput: 'Thinker comparison entry',
        primarySource: 'Andrew Heywood / Brian Nelson',
        status: 'NOT_STARTED'
      });
    }

    topicIdx++;
    current.setDate(current.getDate() + 1);
    day++;
  }
  return tasks;
}