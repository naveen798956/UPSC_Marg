// update-gs-planner.js — Makes GS Planner interactive with full syllabus drill-down & progress tracking
const fs = require('fs');
const path = require('path');

console.log('Updating GS Planner & API to support interactive full-syllabus drill-down...');

// 1. Update app/api/tasks/route.ts to return all seeded syllabus topics
const apiTasksCode = `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInitialSchedule } from '@/lib/scheduler/adaptive-engine';

export async function GET() {
  try {
    const topics = await prisma.syllabusTopic.findMany({ orderBy: { id: 'asc' } });
    const tasks = await prisma.dailyTask.findMany({ orderBy: { scheduledDate: 'asc' } });
    const pyqs = await prisma.pYQ.findMany();
    return NextResponse.json({ tasks, pyqs, topics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { taskId, status, notes } = await req.json();
    const updated = await prisma.dailyTask.update({
      where: { id: taskId },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { personalNotes: notes })
      }
    });
    return NextResponse.json({ success: true, task: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}`;

fs.writeFileSync(path.join(__dirname, 'app/api/tasks/route.ts'), apiTasksCode, 'utf8');
console.log('✓ Updated: app/api/tasks/route.ts (Returns topics with tasks & pyqs)');

// 2. Read existing app/page.tsx and replace the static GS Planner with the dynamic drill-down component
const pagePath = path.join(__dirname, 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Ensure topics and selectedGsPaper state exist
if (!content.includes('const [topics, setTopics] = useState<any[]>([]);')) {
  content = content.replace(
    'const [tasks, setTasks] = useState<any[]>([]);',
    `const [tasks, setTasks] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedGsPaper, setSelectedGsPaper] = useState<'GS1' | 'GS2' | 'GS3' | 'GS4'>('GS2');
  const [gsSearchQuery, setGsSearchQuery] = useState('');
  const [topicStatusMap, setTopicStatusMap] = useState<Record<string, 'NOT_STARTED' | 'IN_PROGRESS' | 'MASTERED'>>({});`
  );
}

// Update loadData in app/page.tsx to set topics
content = content.replace(
  'setTasks(taskData.tasks || []);',
  `setTasks(taskData.tasks || []);
        setTopics(taskData.topics || []);`
);

// New interactive GS Planner JSX block
const interactiveGsPlannerJSX = `{/* 10. INTERACTIVE GS FOUNDATION & FULL SYLLABUS DRILL-DOWN */}
              {activeTab === 'gs-planner' && (() => {
                // Primary Reference Mapping
                const SOURCES_MAP: Record<string, string> = {
                  'GS1': 'Spectrum Modern History, Nitin Singhania Art & Culture, GC Leong Geography, NCERT Class 11/12',
                  'GS2': 'M. Laxmikanth (7th Ed), 2nd ARC Reports, PRS Legislative Research, Indian Express Editorials',
                  'GS3': 'Economic Survey, Union Budget, Shankar IAS / PMF IAS Environment, Ashok Kumar Internal Security',
                  'GS4': 'Lexicon for Ethics, 2nd ARC 4th Report (Ethics in Governance), Applied Case Studies'
                };

                const TITLES_MAP: Record<string, string> = {
                  'GS1': 'GS-1: Indian Heritage, History, Society & World Geography',
                  'GS2': 'GS-2: Governance, Constitution, Polity, Social Justice & IR',
                  'GS3': 'GS-3: Technology, Economic Development, Biodiversity, Security & Disaster Mgmt',
                  'GS4': 'GS-4: Ethics, Integrity and Aptitude (Theory & Applied Case Studies)'
                };

                const currentPaperTopics = topics.filter(t => t.paper === selectedGsPaper);
                const filteredTopics = currentPaperTopics.filter(t => 
                  gsSearchQuery === '' || 
                  t.title.toLowerCase().includes(gsSearchQuery.toLowerCase()) || 
                  t.section.toLowerCase().includes(gsSearchQuery.toLowerCase()) ||
                  t.id.toLowerCase().includes(gsSearchQuery.toLowerCase())
                );

                const getStatus = (topicId: string) => {
                  if (topicStatusMap[topicId]) return topicStatusMap[topicId];
                  const hasCompletedTask = tasks.some(task => task.topicId === topicId && task.status === 'COMPLETED');
                  return hasCompletedTask ? 'MASTERED' : 'NOT_STARTED';
                };

                const cycleStatus = (topicId: string) => {
                  const current = getStatus(topicId);
                  const next = current === 'NOT_STARTED' ? 'IN_PROGRESS' : current === 'IN_PROGRESS' ? 'MASTERED' : 'NOT_STARTED';
                  setTopicStatusMap(prev => ({ ...prev, [topicId]: next }));
                };

                const getPaperStats = (paper: 'GS1' | 'GS2' | 'GS3' | 'GS4') => {
                  const paperTopics = topics.filter(t => t.paper === paper);
                  const total = paperTopics.length || (paper === 'GS1' ? 13 : paper === 'GS2' ? 20 : paper === 'GS3' ? 20 : 9);
                  const mastered = paperTopics.filter(t => getStatus(t.id) === 'MASTERED').length;
                  const inProgress = paperTopics.filter(t => getStatus(t.id) === 'IN_PROGRESS').length;
                  const pct = Math.round((mastered / total) * 100);
                  return { total, mastered, inProgress, pct };
                };

                return (
                  <div className="space-y-6 max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">General Studies Foundation & Full Syllabus Tracker</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Click any subject card below to inspect its full official syllabus, track topic-by-topic completion, and view sources.</p>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded border border-blue-200">
                        Official UPSC Taxonomy (GS I–IV)
                      </span>
                    </div>

                    {/* 4 Interactive Clickable Subject Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {(['GS1', 'GS2', 'GS3', 'GS4'] as const).map((paper) => {
                        const stats = getPaperStats(paper);
                        const isSelected = selectedGsPaper === paper;

                        return (
                          <div 
                            key={paper}
                            onClick={() => setSelectedGsPaper(paper)}
                            className={\`cursor-pointer p-4 rounded-xl border transition duration-200 \${
                              isSelected 
                                ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-400/40' 
                                : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                            }\`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-900 text-white">{paper}</span>
                              <span className="text-[11px] font-bold text-blue-600">{stats.pct}% Covered</span>
                            </div>

                            <h4 className="font-bold text-slate-800 text-xs mt-3 line-clamp-1">{TITLES_MAP[paper].split(':')[1]}</h4>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-serif">{SOURCES_MAP[paper]}</p>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                              <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: \`\${stats.pct}%\` }}></div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                              <span><strong>{stats.mastered}</strong> / {stats.total} Units Done</span>
                              <span className="font-semibold text-blue-700">{isSelected ? 'Active View' : 'Click to View →'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Drill-Down: Full Official Syllabus Checklist for Selected Paper */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">{selectedGsPaper}</span>
                            <h4 className="font-bold text-slate-800 text-sm md:text-base">{TITLES_MAP[selectedGsPaper]}</h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 font-serif"><strong>Standard Sources:</strong> {SOURCES_MAP[selectedGsPaper]}</p>
                        </div>

                        {/* Search in Selected Syllabus */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <input 
                            type="text" 
                            placeholder={\`Search in \${selectedGsPaper} syllabus...\`}
                            value={gsSearchQuery}
                            onChange={(e) => setGsSearchQuery(e.target.value)}
                            className="border rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Coverage Summary Metrics */}
                      <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Official Units</span>
                          <span className="text-base font-bold text-slate-800">{currentPaperTopics.length} Units</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Units Mastered</span>
                          <span className="text-base font-bold text-emerald-600">{getPaperStats(selectedGsPaper).mastered} Units</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Overall Progress</span>
                          <span className="text-base font-bold text-blue-600">{getPaperStats(selectedGsPaper).pct}%</span>
                        </div>
                      </div>

                      {/* Full Official Syllabus List */}
                      <div className="space-y-3 pt-2">
                        {filteredTopics.length > 0 ? (
                          filteredTopics.map((topic, index) => {
                            const status = getStatus(topic.id);
                            return (
                              <div 
                                key={topic.id}
                                className={\`p-4 rounded-xl border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 \${
                                  status === 'MASTERED' 
                                    ? 'bg-emerald-50/50 border-emerald-200' 
                                    : status === 'IN_PROGRESS' 
                                      ? 'bg-amber-50/50 border-amber-200' 
                                      : 'bg-white border-slate-200 hover:border-slate-300'
                                }\`}
                              >
                                <div className="space-y-1.5 flex-1 pr-2">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                      #{index + 1} • {topic.id}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                      {topic.section}
                                    </span>
                                  </div>

                                  <h5 className="font-semibold text-slate-800 text-xs sm:text-sm leading-relaxed">
                                    {topic.title}
                                  </h5>

                                  <p className="text-[11px] text-slate-500 font-serif">
                                    <strong>Authoritative Source:</strong> {SOURCES_MAP[selectedGsPaper].split(',')[0]} & NCERT
                                  </p>
                                </div>

                                {/* Status Toggle Button */}
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                  <button
                                    onClick={() => cycleStatus(topic.id)}
                                    className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm \${
                                      status === 'MASTERED'
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : status === 'IN_PROGRESS'
                                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                                    }\`}
                                  >
                                    {status === 'MASTERED' && '✓ Mastered'}
                                    {status === 'IN_PROGRESS' && '⏳ In Progress'}
                                    {status === 'NOT_STARTED' && '○ Not Started'}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center text-slate-400 text-xs">
                            No syllabus topics match your search keyword. Clear the search box to view the entire syllabus.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}`;

// Replace the old GS foundation placeholder in app/page.tsx
const oldGsRegex = /\{\/\* 10\. GS FOUNDATION \*\/\}[\s\S]*?\{\/\* END GS FOUNDATION \*\/\}/;
const oldGsRegexFallback = /\{\/\* 10\. GS FOUNDATION \*\/\}[\s\S]*?\n\s*\}\)/;

if (oldGsRegex.test(content)) {
  content = content.replace(oldGsRegex, interactiveGsPlannerJSX);
} else {
  // Target the GS planner section directly
  const targetStart = '{/* 10. GS FOUNDATION */}';
  const startIndex = content.indexOf(targetStart);
  if (startIndex !== -1) {
    const nextSectionIndex = content.indexOf('</>', startIndex);
    if (nextSectionIndex !== -1) {
      content = content.substring(0, startIndex) + interactiveGsPlannerJSX + '\n' + content.substring(nextSectionIndex);
    }
  } else {
    // If comment was slightly different
    const fallbackTarget = "activeTab === 'gs-planner' && (";
    const fbIdx = content.indexOf(fallbackTarget);
    if (fbIdx !== -1) {
      const nextEnd = content.indexOf(')}', fbIdx);
      if (nextEnd !== -1) {
        content = content.substring(0, fbIdx - 20) + interactiveGsPlannerJSX + content.substring(nextEnd + 2);
      }
    }
  }
}

fs.writeFileSync(pagePath, content, 'utf8');
console.log('✓ app/page.tsx updated with interactive GS subject cards & full syllabus drill-down.');
console.log('\nUpdate completed successfully! Run: npm run dev (or refresh your browser).');s