// update-psir-planner.js — Interactive PSIR Planner with Full Syllabus Drill-down & Coverage
const fs = require('fs');
const path = require('path');

console.log('Upgrading PSIR Optional Planner to interactive full-syllabus drill-down...');

const pagePath = path.join(__dirname, 'app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add PSIR state if not already present
if (!content.includes('const [selectedPsirPaper, setSelectedPsirPaper]')) {
  content = content.replace(
    "const [selectedGsPaper, setSelectedGsPaper] = useState<'GS1' | 'GS2' | 'GS3' | 'GS4'>('GS2');",
    `const [selectedGsPaper, setSelectedGsPaper] = useState<'GS1' | 'GS2' | 'GS3' | 'GS4'>('GS2');
  const [selectedPsirPaper, setSelectedPsirPaper] = useState<'PSIR_1A' | 'PSIR_1B' | 'PSIR_2A' | 'PSIR_2B'>('PSIR_1A');
  const [psirSearchQuery, setPsirSearchQuery] = useState('');`
  );
}

// 2. New Interactive PSIR Planner JSX
const interactivePsirJSX = `{/* 6. INTERACTIVE PSIR OPTIONAL PLANNER WITH FULL SYLLABUS DRILL-DOWN */}
              {activeTab === 'psir-planner' && (() => {
                const PSIR_TITLES: Record<string, string> = {
                  'PSIR_1A': 'Paper 1A: Political Theory & Thought (Western & Indian Thinkers)',
                  'PSIR_1B': 'Paper 1B: Indian Government & Politics (IGP & Constitutional Dynamics)',
                  'PSIR_2A': 'Paper 2A: Comparative Politics & International Relations Theories',
                  'PSIR_2B': 'Paper 2B: India\\'s Foreign Policy (Determinants, Bilateral & Global Order)'
                };

                const PSIR_SOURCES: Record<string, string> = {
                  'PSIR_1A': 'Brian Nelson (Western Thought), Andrew Heywood (Political Theory), O.P. Gauba, Michael Sandel',
                  'PSIR_1B': 'Granville Austin (Cornerstone of a Nation), Niraja Jayal & Pratap Bhanu Mehta (Oxford Companion), Bipan Chandra',
                  'PSIR_2A': 'Baylis, Smith & Owens (The Globalization of World Politics), Andrew Heywood (Global Politics), J.C. Johari',
                  'PSIR_2B': 'David Malone (Does the Elephant Dance?), S. Jaishankar (The India Way), C. Raja Mohan, MEA Strategic Briefs'
                };

                const currentPaperTopics = topics.filter(t => t.paper === selectedPsirPaper);
                const filteredTopics = currentPaperTopics.filter(t => 
                  psirSearchQuery === '' || 
                  t.title.toLowerCase().includes(psirSearchQuery.toLowerCase()) || 
                  t.section.toLowerCase().includes(psirSearchQuery.toLowerCase()) ||
                  t.id.toLowerCase().includes(psirSearchQuery.toLowerCase())
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

                const getPsirStats = (paper: 'PSIR_1A' | 'PSIR_1B' | 'PSIR_2A' | 'PSIR_2B') => {
                  const paperTopics = topics.filter(t => t.paper === paper);
                  const total = paperTopics.length || (paper === 'PSIR_1A' ? 10 : paper === 'PSIR_1B' ? 13 : paper === 'PSIR_2A' ? 12 : 9);
                  const mastered = paperTopics.filter(t => getStatus(t.id) === 'MASTERED').length;
                  const inProgress = paperTopics.filter(t => getStatus(t.id) === 'IN_PROGRESS').length;
                  const pct = Math.round((mastered / total) * 100);
                  return { total, mastered, inProgress, pct };
                };

                return (
                  <div className="space-y-6 max-w-6xl mx-auto">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base md:text-lg">PSIR Optional Dedicated Command Centre</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                            500 Marks
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">Select any paper quadrant to inspect the full syllabus, track thinker mastery, and review scholar debates.</p>
                      </div>
                      <span className="px-3 py-1 bg-white/10 text-amber-300 font-bold text-xs rounded border border-white/20">
                        Official UPSC PSIR Taxonomy
                      </span>
                    </div>

                    {/* 4 Interactive Paper Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {(['PSIR_1A', 'PSIR_1B', 'PSIR_2A', 'PSIR_2B'] as const).map((paper) => {
                        const stats = getPsirStats(paper);
                        const isSelected = selectedPsirPaper === paper;

                        return (
                          <div 
                            key={paper}
                            onClick={() => setSelectedPsirPaper(paper)}
                            className={\`cursor-pointer p-4 rounded-xl border transition duration-200 \${
                              isSelected 
                                ? 'bg-indigo-50/80 border-indigo-500 shadow-md ring-2 ring-indigo-400/40' 
                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                            }\`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                                {paper.replace('_', ' ')}
                              </span>
                              <span className="text-[11px] font-bold text-indigo-700">{stats.pct}% Covered</span>
                            </div>

                            <h4 className="font-bold text-slate-800 text-xs mt-3 line-clamp-1">{PSIR_TITLES[paper].split(':')[1]}</h4>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-serif">{PSIR_SOURCES[paper]}</p>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                              <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: \`\${stats.pct}%\` }}></div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                              <span><strong>{stats.mastered}</strong> / {stats.total} Units Done</span>
                              <span className="font-semibold text-indigo-700">{isSelected ? 'Active View' : 'Click to View →'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Drill-Down: Full Syllabus Units for Selected Paper */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-indigo-700 text-white font-bold text-xs">
                              {selectedPsirPaper.replace('_', ' ')}