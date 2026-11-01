// upgrade.js — Complete Dynamic & Internet-Connected Upgrade
const fs = require('fs');
const path = require('path');

console.log('Starting UPSC Master Planner Dynamic Upgrade...');

// 1. UPDATE: lib/current-affairs/retrieval-service.ts (Live Internet Fetcher)
const retrievalServiceCode = `export interface CurrentAffairItem {
  id: string;
  headline: string;
  date: string;
  source: string;
  sourceUrl: string;
  gsLink: string;
  psirLink: string;
  prelimsFact: string;
  mainsDimension: string;
  isLive: boolean;
}

export async function fetchVerifiedCurrentAffairs(): Promise<CurrentAffairItem[]> {
  try {
    // Connect to live internet RSS from Press Information Bureau (PIB)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch('https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) UPSCMasterPlanner/2.0' },
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const xml = await res.text();
      const items: CurrentAffairItem[] = [];
      const itemRegex = /<item>([\\s\\S]*?)<\\/item>/g;
      let match;
      let count = 0;

      while ((match = itemRegex.exec(xml)) !== null && count < 8) {
        const block = match[1];
        const titleMatch = block.match(/<title><!\\[CDATA\\[(.*?)\\]\\]><\\/title>/) || block.match(/<title>(.*?)<\\/title>/);
        const linkMatch = block.match(/<link>(.*?)<\\/link>/);
        const descMatch = block.match(/<description><!\\[CDATA\\[(.*?)\\]\\]><\\/description>/) || block.match(/<description>(.*?)<\\/description>/);
        const dateMatch = block.match(/<pubDate>(.*?)<\\/pubDate>/);

        const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').trim() : '';
        const link = linkMatch ? linkMatch[1].trim() : 'https://pib.gov.in';
        const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        const pubDate = dateMatch ? new Date(dateMatch[1]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        if (title.length > 10) {
          // Dynamic Syllabus Mapping based on keywords
          const text = (title + ' ' + desc).toLowerCase();
          let gsLink = 'GS2: Governance & Executive Policies';
          let psirLink = 'PSIR 1B: Indian Administration & Public Policy';

          if (text.includes('constitution') || text.includes('court') || text.includes('tribunal') || text.includes('act') || text.includes('bill')) {
            gsLink = 'GS2: Constitution, Judiciary & Statutory Bodies';
            psirLink = 'PSIR 1B: Judicial Review & Constitutional Dynamics';
          } else if (text.includes('foreign') || text.includes('mou') || text.includes('bilateral') || text.includes('defence') || text.includes('global') || text.includes('summit')) {
            gsLink = 'GS2: International Relations & Bilateral Accords';
            psirLink = 'PSIR 2B: India and Major Powers / Foreign Policy';
          } else if (text.includes('economy') || text.includes('finance') || text.includes('trade') || text.includes('rbi') || text.includes('inflation') || text.includes('export')) {
            gsLink = 'GS3: Indian Economy & Fiscal Policy';
            psirLink = 'PSIR 2A: Global Political Economy';
          } else if (text.includes('climate') || text.includes('forest') || text.includes('pollution') || text.includes('green') || text.includes('energy') || text.includes('solar')) {
            gsLink = 'GS3: Environment, Ecology & Sustainable Development';
            psirLink = 'PSIR 2A: Transnational Environmental Concerns';
          }

          items.push({
            id: 'PIB-LIVE-' + count + '-' + Date.now(),
            headline: title,
            date: pubDate,
            source: 'Press Information Bureau (PIB Live Feed)',
            sourceUrl: link,
            gsLink,
            psirLink,
            prelimsFact: desc.slice(0, 160) + '...',
            mainsDimension: 'Examines policy impact on federal governance, institutional capacity, and statutory mandates.',
            isLive: true
          });
          count++;
        }
      }

      if (items.length > 0) return items;
    }
  } catch (err) {
    console.warn('Live internet fetch unsuccessful. Using verified high-yield offline repository.');
  }

  // Curated Fallback Data
  return [
    {
      id: 'CA-CURATED-01',
      headline: 'Supreme Court Constitution Bench: Federal Limits on State Powers in River Dispute Adjudications',
      date: new Date().toISOString().split('T')[0],
      source: 'Official Court Record & PIB Analysis',
      sourceUrl: 'https://pib.gov.in',
      gsLink: 'GS2: Federalism & Inter-State Relations (Art 262)',
      psirLink: 'PSIR 1B: Federal Dynamics & Regionalism',
      prelimsFact: 'Article 262(2) bars jurisdiction of the Supreme Court and high courts over statutory river tribunal awards.',
      mainsDimension: 'Evaluates cooperative federalism vs judicial interventionism in long-standing interstate hydro-politics.',
      isLive: false
    },
    {
      id: 'CA-CURATED-02',
      headline: 'India Consolidates Indo-Pacific Maritime Security and Minilateral Logistics Accords',
      date: new Date().toISOString().split('T')[0],
      source: 'Ministry of External Affairs (MEA)',
      sourceUrl: 'https://mea.gov.in',
      gsLink: 'GS2: Bilateral, Regional & Global Groupings',
      psirLink: 'PSIR 2B: Strategic Autonomy & Major Powers',
      prelimsFact: 'Information Fusion Centre - Indian Ocean Region (IFC-IOR) is based at Gurugram, India.',
      mainsDimension: 'Assesses multipolarity, strategic autonomy, and maritime deterrence in the Indian Ocean.',
      isLive: false
    },
    {
      id: 'CA-CURATED-03',
      headline: 'Reserve Bank of India Monetary Policy Review: Inflation Targeting & Capital Adequacy Ratios',
      date: new Date().toISOString().split('T')[0],
      source: 'RBI Bulletins & Financial Express',
      sourceUrl: 'https://rbi.org.in',
      gsLink: 'GS3: Macroeconomics & Banking Sector Reforms',
      psirLink: 'PSIR 1B: Political Economy of Planning and Development',
      prelimsFact: 'Monetary Policy Committee (MPC) is constituted under Section 45ZB of the amended RBI Act, 1934.',
      mainsDimension: 'Balancing inflation control with employment generation and credit growth in emerging markets.',
      isLive: false
    }
  ];
}`;

fs.writeFileSync(path.join(__dirname, 'lib/current-affairs/retrieval-service.ts'), retrievalServiceCode, 'utf8');
console.log('✓ Updated: lib/current-affairs/retrieval-service.ts (Live Internet Fetcher)');

// 2. UPDATE: app/api/tasks/route.ts (Support task toggle and notes update)
const tasksApiCode = `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInitialSchedule } from '@/lib/scheduler/adaptive-engine';

export async function GET() {
  try {
    let tasks = await prisma.dailyTask.findMany({ orderBy: { scheduledDate: 'asc' } });
    if (tasks.length === 0) {
      const topics = await prisma.syllabusTopic.findMany();
      const generated = generateInitialSchedule(
        { prelimsDate: '2027-05-23', mainsDate: '2027-08-20', prelimsPivotDate: '2027-03-01', dailyHours: 8.0 },
        topics
      );
      for (const t of generated.slice(0, 100)) {
        await prisma.dailyTask.create({ data: t });
      }
      tasks = await prisma.dailyTask.findMany({ orderBy: { scheduledDate: 'asc' } });
    }
    const pyqs = await prisma.pYQ.findMany();
    return NextResponse.json({ tasks, pyqs });
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

fs.writeFileSync(path.join(__dirname, 'app/api/tasks/route.ts'), tasksApiCode, 'utf8');
console.log('✓ Updated: app/api/tasks/route.ts (Persistence Enabled)');

// 3. UPDATE: app/page.tsx (Comprehensive Multi-Tab Dynamic UI)
const appPageCode = `'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Target, Map as MapIcon, BookOpen, Globe, 
  FileText, HelpCircle, Edit3, CheckCircle, Clock, RotateCcw, 
  Search, RefreshCw, Bookmark, Sparkles, SlidersHorizontal, 
  Calendar, Layers, CheckSquare, ExternalLink, ChevronRight, PenTool
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<any[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [currentAffairs, setCurrentAffairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingNews, setSyncingNews] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('ALL');
  const [selectedCaCategory, setSelectedCaCategory] = useState('ALL');

  // PYQ Interactive State
  const [selectedPyqOptions, setSelectedPyqOptions] = useState<Record<string, string>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  // Mains Answer Lab State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  // PSIR Thinker Comparison State
  const [thinkerA, setThinkerA] = useState('rawls');
  const [thinkerB, setThinkerB] = useState('nozick');

  // Spaced Repetition State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);

  // Notes State
  const [personalNotes, setPersonalNotes] = useState<Array<{ id: string; title: string; tag: string; content: string }>>([
    {
      id: 'N-1',
      title: 'Kesavananda Bharati (1973) 7:6 Ratio Summary',
      tag: 'GS2 / PSIR-1B',
      content: 'Chief Justice Sikri: Basic structure includes supremacy of Constitution, republican & democratic form, secular character, separation of powers, and federal character.'
    },
    {
      id: 'N-2',
      title: 'Rawls vs Sen: Transcendental Institutionalism vs Nyaya',
      tag: 'PSIR-1A',
      content: 'Amartya Sen in The Idea of Justice (2009) critiques Rawlsian ideal institutions (Niti) as insufficient; justice requires removing manifest real-world injustices (Nyaya).'
    }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const loadData = async () => {
    try {
      const [taskRes, caRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/current-affairs/sync')
      ]);
      const taskData = await taskRes.json();
      const caData = await caRes.json();
      setTasks(taskData.tasks || []);
      setPyqs(taskData.pyqs || []);
      setCurrentAffairs(caData.items || []);
    } catch (e) {
      console.error('Data load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const nextStatus = task.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';

    setTasks(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t));
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: id, status: nextStatus })
      });
    } catch (err) {
      console.error('Failed to save task update:', err);
    }
  };

  const handleLiveNewsSync = async () => {
    setSyncingNews(true);
    try {
      const res = await fetch('/api/current-affairs/sync');
      const data = await res.json();
      setCurrentAffairs(data.items || []);
    } catch (e) {
      alert('Could not sync live news feed.');
    } finally {
      setSyncingNews(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    try {
      const res = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userContent: userAnswer, 
          wordLimit: 250, 
          marks: 15,
          paperCode: 'GS2'
        })
      });
      const data = await res.json();
      setAiEvaluation(data);
    } catch {
      alert('Evaluation server call failed.');
    } finally {
      setEvaluating(false);
    }
  };

  const addNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    setPersonalNotes([
      { id: 'NOTE-' + Date.now(), title: newNoteTitle, tag: 'GS / PSIR', content: newNoteContent },
      ...personalNotes
    ]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  // Safe today tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const matchingToday = tasks.filter(t => t.scheduledDate === todayStr);
  const todayTasks = matchingToday.length > 0 ? matchingToday : tasks.slice(0, 3);

  // Thinker Data Bank
  const THINKER_DB: Record<string, { name: string; tradition: string; primaryWork: string; coreThesis: string; primaryCritic: string }> = {
    rawls: {
      name: 'John Rawls',
      tradition: 'Deontological Liberalism',
      primaryWork: 'A Theory of Justice (1971)',
      coreThesis: 'Justice as fairness. Uses Original Position and Veil of Ignorance. Lexical priority of equal basic liberties over difference principle (inequalities justified only if benefiting least advantaged).',
      primaryCritic: 'Robert Nozick (Entitlement Theory), Amartya Sen (Nyaya vs Niti), Michael Sandel (Unencumbered Self).'
    },
    nozick: {
      name: 'Robert Nozick',
      tradition: 'Libertarianism / Minarchism',
      primaryWork: 'Anarchy, State, and Utopia (1974)',
      coreThesis: 'Entitlement Theory of Justice. Holding is just if acquired through just initial acquisition or voluntary transfer. Rejects patterned redistribution as forced labor.',
      primaryCritic: 'G.A. Cohen (Marxist egalitarian), John Rawls.'
    },
    sen: {
      name: 'Amartya Sen',
      tradition: 'Capability Approach',
      primaryWork: 'The Idea of Justice (2009)',
      coreThesis: 'Realisation-focused comparison. Prioritises practical removal of manifest injustices (Nyaya) over constructing hypothetical ideal institutions (Niti). Focuses on substantive capabilities.',
      primaryCritic: 'Transcendental institutionalists who argue institutional benchmarks are necessary.'
    },
    machiavelli: {
      name: 'Niccolò Machiavelli',
      tradition: 'Political Realism',
      primaryWork: 'The Prince (1532)',
      coreThesis: 'Autonomy of politics from conventional Christian morality. Dual morality: the ruler must use both force (lion) and cunning (fox) for the preservation and glory of the state.',
      primaryCritic: 'Leo Strauss (teacher of evil critique), Immanuel Kant (moral categorical imperative).'
    },
    morgenthau: {
      name: 'Hans Morgenthau',
      tradition: 'Classical Realism (IR)',
      primaryWork: 'Politics Among Nations (1948)',
      coreThesis: 'International politics is governed by objective laws rooted in human nature. States define national interest in terms of power. Universal moral principles cannot be applied to state actions.',
      primaryCritic: 'Kenneth Waltz (Structural Realism), Alexander Wendt (Social Constructivism).'
    },
    waltz: {
      name: 'Kenneth Waltz',
      tradition: 'Neo-Realism / Structural Realism',
      primaryWork: 'Theory of International Politics (1979)',
      coreThesis: 'The international system is defined by anarchic structure, not human nature. Self-help system compels states to prioritize survival, balance of power, and relative gains over absolute gains.',
      primaryCritic: 'Robert Keohane (Neoliberal Institutionalism), Wendt (Anarchy is what states make of it).'
    }
  };

  // Active Recall Flashcard Bank
  const FLASHCARDS = [
    {
      q: 'What are the 5 non-derogable features of Basic Structure laid out in Kesavananda Bharati by CJI Sikri?',
      a: '1. Supremacy of the Constitution\\n2. Republican & Democratic form of Government\\n3. Secular character\\n4. Separation of Powers between Legislature, Executive & Judiciary\\n5. Federal character of the Constitution.'
    },
    {
      q: 'Differentiate between Rawlsian "Niti" and Sen’s "Nyaya" in theories of justice.',
      a: 'Niti refers to organizational correctness and institutional propriety (transcendental rules). Nyaya represents realized justice—what emerges in real people\\'s lives and eliminating concrete deprivations.'
    },
    {
      q: 'Which constitutional article limits the jurisdiction of courts in Inter-State River Water Disputes?',
      a: 'Article 262(2) allows Parliament by law to provide that neither Supreme Court nor any other court shall exercise jurisdiction over disputes regarding inter-state rivers adjudicated under the 1956 Act.'
    }
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 z-20 select-none">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
              IAS
            </div>
            <div>
              <h1 className="text-sm font-bold text-white uppercase tracking-wider">UPSC Master</h1>
              <p className="text-[11px] text-amber-400 font-medium">GS + PSIR • CSE 2027</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-xs">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'dashboard' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" /> Dashboard
          </button>

          <button 
            onClick={() => setActiveTab('today')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'today' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <Target className="w-4 h-4 text-emerald-400" /> Today's Study Plan
          </button>

          <button 
            onClick={() => setActiveTab('complete-plan')} 
            className={\`w-full flex items-center justify-between px-3 py-2 rounded-md font-semibold text-amber-300 bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/60 transition\`}
          >
            <div className="flex items-center gap-3">
              <MapIcon className="w-4 h-4 text-amber-400" /> Complete Plan Viewer
            </div>
            <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-bold uppercase">Core</span>
          </button>

          <div className="pt-3 pb-1 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Syllabus & Subjects</div>
          <button 
            onClick={() => setActiveTab('gs-planner')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'gs-planner' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <BookOpen className="w-4 h-4 text-blue-300" /> GS Foundation (I–IV)
          </button>

          <button 
            onClick={() => setActiveTab('psir-planner')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'psir-planner' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <Globe className="w-4 h-4 text-indigo-400" /> PSIR Optional Planner
          </button>

          <div className="pt-3 pb-1 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Practice & Output</div>
          <button 
            onClick={() => setActiveTab('current-affairs')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'current-affairs' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <FileText className="w-4 h-4 text-teal-400" /> Live Current Affairs
          </button>

          <button 
            onClick={() => setActiveTab('pyq')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'pyq' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" /> Verified PYQs
          </button>

          <button 
            onClick={() => setActiveTab('mains-answer')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'mains-answer' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <Edit3 className="w-4 h-4 text-rose-400" /> Mains Answer Writing
          </button>

          <button 
            onClick={() => setActiveTab('spaced-revision')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'spaced-revision' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" /> Spaced Revision Queue
          </button>

          <button 
            onClick={() => setActiveTab('notes-desk')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'notes-desk' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <Bookmark className="w-4 h-4 text-purple-400" /> Topic Notes & Citations
          </button>
        </nav>

        {/* Official UPSC Calendar Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-amber-400 font-semibold">Prelims: 23 May '27</span>
            <span className="text-white font-bold">209d</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-indigo-400 font-medium">Mains: 20 Aug '27</span>
            <span className="text-slate-300">298d</span>
          </div>
        </div>
      </aside>

      {/* Main Execution Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Phase 2: Comprehensive GS + PSIR Completion
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'current-affairs' && (
              <button 
                onClick={handleLiveNewsSync} 
                disabled={syncingNews}
                className="px-3 py-1.5 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 flex items-center gap-1.5 shadow-sm transition"
              >
                <RefreshCw className={\`w-3.5 h-3.5 \${syncingNews ? 'animate-spin' : ''}\`} />
                {syncingNews ? 'Connecting to PIB...' : 'Fetch Latest Online'}
              </button>
            )}
            <button 
              onClick={async () => {
                const res = await fetch('/api/schedule/rebalance', { method: 'POST' });
                const d = await res.json();
                alert(d.message || 'Timetable recalibrated.');
              }} 
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 flex items-center gap-1.5 shadow-sm transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Rebalance Schedule
            </button>
          </div>
        </header>

        {/* View Router */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <Clock className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
              Loading verified preparation repository...
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 max-w-6xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-xs text-slate-500 font-medium">Daily Completed</span>
                      <div className="text-2xl font-bold text-slate-800 mt-2">
                        {todayTasks.filter(t => t.status === 'COMPLETED').length} / {todayTasks.length}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Sessions Completed</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-xs text-slate-500 font-medium">Prelims 2027</span>
                      <div className="text-2xl font-bold text-amber-600 mt-2">209 Days</div>
                      <p className="text-[11px] text-slate-400 mt-1">23 May 2027 (Official)</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-xs text-slate-500 font-medium">Mains 2027</span>
                      <div className="text-2xl font-bold text-indigo-600 mt-2">298 Days</div>
                      <p className="text-[11px] text-slate-400 mt-1">20 August 2027</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-xs text-slate-500 font-medium">Prelims Pivot</span>
                      <div className="text-xl font-bold text-rose-600 mt-2">01 March '27</div>
                      <p className="text-[11px] text-slate-400 mt-1">Mission Mode: 80% MCQs/CSAT</p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-sm">Today's Focus Tasks</h3>
                      <button onClick={() => setActiveTab('today')} className="text-xs font-semibold text-blue-600 hover:underline">
                        Open Full Study Guide →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {todayTasks.map((t) => (
                        <div key={t.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-100/70 transition">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded text-[10px] font-bold">Session {t.sessionNumber}</span>
                              <span className="text-xs font-bold text-slate-800">{t.subject}</span>
                              <span className="text-[11px] text-slate-500">• {t.durationHours} Hours</span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium">{t.actionTitle}</p>
                            <p className="text-[11px] text-slate-500 font-serif">Source: {t.primarySource}</p>
                          </div>
                          <button 
                            onClick={() => toggleTaskStatus(t.id)} 
                            className={\`px-3 py-1.5 rounded text-xs font-semibold transition \${t.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}\`}
                          >
                            {t.status === 'COMPLETED' ? '✓ Mastered' : 'Mark Complete'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. TODAY'S STUDY PLAN */}
              {activeTab === 'today' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Productive Routine: 8 Hours Structured</span>
                      <h3 className="text-lg font-bold text-slate-800">Today's Actionable Agenda & Study Instructions</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Syllabus-mapped readings, concrete micro-steps, and concept extraction.</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-200">
                      Day Active
                    </span>
                  </div>

                  <div className="space-y-4">
                    {todayTasks.map((t, idx) => (
                      <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t.subject}</span>
                              <h4 className="text-sm font-bold text-slate-800">{t.actionTitle}</h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-medium">{t.durationHours} Hours</span>
                            <button 
                              onClick={() => toggleTaskStatus(t.id)} 
                              className={\`px-3 py-1 rounded text-xs font-semibold transition \${t.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}\`}
                            >
                              {t.status === 'COMPLETED' ? '✓ Mastered' : 'Mark Completed'}
                            </button>
                          </div>
                        </div>

                        <div className="p-5 space-y-4 text-xs text-slate-700">
                          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/60">
                            <strong className="text-amber-900 uppercase text-[10px] tracking-wide block mb-1">Authoritative Source:</strong>
                            <p className="font-serif text-slate-800 font-medium">{t.primarySource}</p>
                          </div>

                          <div>
                            <strong className="text-slate-800 uppercase text-[10px] tracking-wider block mb-1.5">How to Read & Step-by-Step Instructions:</strong>
                            <p className="leading-relaxed text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 font-mono text-[11px]">{t.stepNotes}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 items-center">
                            <span className="font-bold text-slate-500 text-[10px] uppercase">Core Concepts:</span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] border border-slate-200 font-medium">{t.keyConcepts}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                            <span><strong>Target Output:</strong> {t.expectedOutput}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. COMPLETE PLAN VIEWER WITH FILTERS & CSV EXPORT */}
              {activeTab === 'complete-plan' && (
                <div className="space-y-4 max-w-6xl mx-auto">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Complete Date-wise Preparation Roadmap</h3>
                      <p className="text-xs text-slate-500">From Today through Prelims (23 May 2027) and Mains (20 August 2027)</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select 
                        value={selectedPhaseFilter}
                        onChange={(e) => setSelectedPhaseFilter(e.target.value)}
                        className="border rounded p-1.5 text-xs text-slate-700 bg-white"
                      >
                        <option value="ALL">All Phases</option>
                        <option value="Phase 2">Phase 2: Foundation</option>
                        <option value="Phase 4">Phase 4: Prelims Mode</option>
                        <option value="Phase 5">Phase 5: Mains Sprint</option>
                      </select>

                      <button 
                        onClick={() => {
                          const csv = "Date,Subject,Action,Hours,Status\\n" + tasks.map(t => \`"\${t.scheduledDate}","\${t.subject}","\${t.actionTitle}",\${t.durationHours},\${t.status}\`).join('\\n');
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'UPSC_Master_Plan_2026_2027.csv';
                          a.click();
                        }}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Date</th>
                          <th className="p-3">Phase</th>
                          <th className="p-3">Subject</th>
                          <th className="p-3">Action Title</th>
                          <th className="p-3">Source</th>
                          <th className="p-3">Hours</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {tasks
                          .filter(t => selectedPhaseFilter === 'ALL' || t.phase.includes(selectedPhaseFilter))
                          .slice(0, 50)
                          .map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-900">{t.scheduledDate}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-medium border border-blue-200">
                                {t.phase.split(':')[0]}
                              </span>
                            </td>
                            <td className="p-3 font-medium text-slate-800">{t.subject}</td>
                            <td className="p-3 text-slate-600">{t.actionTitle}</td>
                            <td className="p-3 text-slate-500 font-serif text-[11px]">{t.primarySource}</td>
                            <td className="p-3 font-bold">{t.durationHours}h</td>
                            <td className="p-3">
                              <span className={\`px-2 py-0.5 rounded text-[10px] font-bold \${t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}\`}>
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. CURRENT AFFAIRS: LIVE INTERNET RETRIEVAL & FILTER */}
              {activeTab === 'current-affairs' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-base">Current Affairs & Static Mapping</h3>
                        <span className={\`px-2 py-0.5 rounded text-[10px] font-bold border \${currentAffairs[0]?.isLive ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'}\`}>
                          {currentAffairs[0]?.isLive ? '● Live Internet PIB Sync' : 'Verified Repository'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Press Information Bureau (PIB) & MEA updates mapped to GS & PSIR topics.</p>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Search current affairs..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border rounded p-1.5 text-xs text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {currentAffairs
                      .filter(item => searchQuery === '' || item.headline.toLowerCase().includes(searchQuery.toLowerCase()) || item.gsLink.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(item => (
                      <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800 text-sm leading-snug">{item.headline}</h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-3">{item.date}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-semibold border border-blue-200 text-[10px]">
                            {item.gsLink}
                          </span>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-800 rounded font-semibold border border-purple-200 text-[10px]">
                            {item.psirLink}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2 text-slate-700 leading-relaxed">
                          <p><strong className="text-slate-900">Prelims Fact Traps:</strong> {item.prelimsFact}</p>
                          <p><strong className="text-slate-900">Mains Analytical Angle:</strong> {item.mainsDimension}</p>
                        </div>

                        <div className="flex justify-between items-center pt-1 text-[11px] text-slate-500 font-serif">
                          <span>Source: {item.source}</span>
                          <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                            Official Press Release <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. VERIFIED PYQ PRACTICE ENGINE */}
              {activeTab === 'pyq' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">UPSC Official PYQ Practice Engine</h3>
                      <p className="text-xs text-slate-500">Genuine commission questions with option elimination and official answer keys.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded border border-amber-200">
                      Verified PYQ Bank
                    </span>
                  </div>

                  <div className="space-y-4">
                    {pyqs.map(p => {
                      const options = p.optionsJson ? JSON.parse(p.optionsJson) : [];
                      const selected = selectedPyqOptions[p.id];
                      const revealed = revealedExplanations[p.id];

                      return (
                        <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
                                UPSC {p.stage} {p.year}
                              </span>
                              <span className="text-slate-600 font-semibold">{p.paper}</span>
                            </div>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Official Commission Question
                            </span>
                          </div>

                          <p className="text-sm font-medium text-slate-800 leading-relaxed">{p.questionText}</p>

                          {options.length > 0 && (
                            <div className="space-y-2 pt-1">
                              {options.map((opt: any) => {
                                const isSelected = selected === opt.id;
                                const isCorrect = opt.id === p.correctOption;

                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => {
                                      setSelectedPyqOptions({ ...selectedPyqOptions, [p.id]: opt.id });
                                      setRevealedExplanations({ ...revealedExplanations, [p.id]: true });
                                    }}
                                    className={\`w-full p-2.5 rounded border text-left flex items-center gap-2 transition \${
                                      isSelected
                                        ? isCorrect
                                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                                          : 'bg-rose-100 border-rose-400 text-rose-900 font-bold'
                                        : 'hover:bg-slate-50 text-slate-700 border-slate-200'
                                    }\`}
                                  >
                                    <span className="font-bold">{opt.id})</span> {opt.text}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {revealed && p.explanation && (
                            <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 space-y-1">
                              <strong className="block text-xs text-emerald-950 font-bold">Official UPSC Answer: Option {p.correctOption}</strong>
                              <p className="leading-relaxed">{p.explanation}</p>
                            </div>
                          )}

                          {p.modelIntro && (
                            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-700 space-y-2">
                              <strong className="text-slate-900 uppercase text-[10px]">Mains Model Structure:</strong>
                              <p><strong>Introduction:</strong> {p.modelIntro}</p>
                              <p><strong>Body:</strong> {p.modelBody}</p>
                              <p><strong>Conclusion:</strong> {p.modelConclusion}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. PSIR DEDICATED PLANNER & DYNAMIC THINKER COMPARATOR */}
              {activeTab === 'psir-planner' && (
                <div className="space-y-5 max-w-5xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">PSIR Optional Dedicated Command Centre</h3>
                      <p className="text-xs text-slate-500">Political Theory (1A), IGP (1B), Comparative/IR Theories (2A) & India's Foreign Policy (2B).</p>
                    </div>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded border border-indigo-200">
                      PSIR Mastery Matrix
                    </span>
                  </div>

                  {/* Dynamic Thinker Comparison Matrix */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Interactive Thinker Comparison Tool
                      </h4>
                      <div className="flex items-center gap-2 text-xs">
                        <select 
                          value={thinkerA} 
                          onChange={(e) => setThinkerA(e.target.value)} 
                          className="border rounded p-1.5 bg-white font-semibold text-slate-700"
                        >
                          {Object.keys(THINKER_DB).map(k => (
                            <option key={k} value={k}>{THINKER_DB[k].name}</option>
                          ))}
                        </select>
                        <span className="font-bold text-slate-400">VS</span>
                        <select 
                          value={thinkerB} 
                          onChange={(e) => setThinkerB(e.target.value)} 
                          className="border rounded p-1.5 bg-white font-semibold text-slate-700"
                        >
                          {Object.keys(THINKER_DB).map(k => (
                            <option key={k} value={k}>{THINKER_DB[k].name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Thinker A Card */}
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h5 className="font-bold text-blue-900 text-sm">{THINKER_DB[thinkerA]?.name}</h5>
                          <span className="text-[10px] font-semibold text-blue-700">{THINKER_DB[thinkerA]?.tradition}</span>
                        </div>
                        <p className="italic text-slate-600 font-serif">Major Work: {THINKER_DB[thinkerA]?.primaryWork}</p>
                        <div className="pt-2 border-t border-blue-100">
                          <strong className="block text-slate-800 mb-1">Core Theoretical Thesis:</strong>
                          <p className="leading-relaxed text-slate-700">{THINKER_DB[thinkerA]?.coreThesis}</p>
                        </div>
                        <div className="pt-2 border-t border-blue-100">
                          <strong className="block text-slate-800 mb-1">Primary Academic Critics:</strong>
                          <p className="text-slate-600">{THINKER_DB[thinkerA]?.primaryCritic}</p>
                        </div>
                      </div>

                      {/* Thinker B Card */}
                      <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h5 className="font-bold text-indigo-900 text-sm">{THINKER_DB[thinkerB]?.name}</h5>
                          <span className="text-[10px] font-semibold text-indigo-700">{THINKER_DB[thinkerB]?.tradition}</span>
                        </div>
                        <p className="italic text-slate-600 font-serif">Major Work: {THINKER_DB[thinkerB]?.primaryWork}</p>
                        <div className="pt-2 border-t border-indigo-100">
                          <strong className="block text-slate-800 mb-1">Core Theoretical Thesis:</strong>
                          <p className="leading-relaxed text-slate-700">{THINKER_DB[thinkerB]?.coreThesis}</p>
                        </div>
                        <div className="pt-2 border-t border-indigo-100">
                          <strong className="block text-slate-800 mb-1">Primary Academic Critics:</strong>
                          <p className="text-slate-600">{THINKER_DB[thinkerB]?.primaryCritic}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. MAINS ANSWER WRITING & EVALUATION */}
              {activeTab === 'mains-answer' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-600 uppercase">Timed Practice: 15 Marks (250 Words)</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold bg-slate-900 text-white px-3 py-1 rounded shadow-sm">
                            {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}
                          </span>
                          <button 
                            onClick={() => setTimerActive(!timerActive)} 
                            className={\`px-3 py-1 rounded text-xs font-semibold text-white transition \${timerActive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}\`}
                          >
                            {timerActive ? 'Pause' : 'Start Timer'}
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-800 text-sm leading-snug">
                        "The doctrine of Basic Structure has not only preserved the ethos of the Indian Constitution but has also dynamically adapted to constitutional evolution. Discuss with reference to leading judicial pronouncements."
                      </h4>

                      <textarea 
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full h-72 border rounded-lg p-3 text-xs font-mono leading-relaxed text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        placeholder="Type your structured answer here (Introduction, Kesavananda Bharati context, S.R. Bommai/Minerva Mills adaptation, counterarguments, and Way Forward)..."
                      />

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">
                          Word Count: <strong className="text-slate-800">{userAnswer.trim() ? userAnswer.trim().split(/\\s+/).length : 0}</strong> / 250
                        </span>
                        <button 
                          onClick={evaluateAnswer} 
                          disabled={evaluating || !userAnswer.trim()}
                          className="px-4 py-2 bg-slate-900 text-white rounded font-semibold text-xs hover:bg-slate-800 disabled:opacity-50 transition"
                        >
                          {evaluating ? 'Evaluating...' : 'Submit for UPSC Rubric Evaluation'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
                      <h4 className="font-bold text-slate-800 text-sm border-b pb-2">UPSC 7-Criteria Scorecard</h4>
                      {aiEvaluation ? (
                        <div className="space-y-3">
                          <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                            <span className="font-bold text-emerald-900 block text-sm">
                              Score: {aiEvaluation.awardedScore} / {aiEvaluation.totalMarks} ({aiEvaluation.percentage}%)
                            </span>
                            <span className="text-[11px] text-emerald-800">{aiEvaluation.evaluationBand}</span>
                          </div>
                          <div className="text-slate-600 space-y-1">
                            <p><strong>Words Written:</strong> {aiEvaluation.wordCount} words</p>
                            <p><strong>Word Compliance:</strong> {aiEvaluation.isWordCountCompliant ? 'Optimal' : 'Needs Adjustment'}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-400 leading-relaxed">
                          Start the timer, write your response to the 15-mark question, and submit to receive instant criteria-by-criteria scoring on directive relevance, constitutional citations, and structure.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 8. SPACED REVISION ACTIVE RECALL FLASHCARDS */}
              {activeTab === 'spaced-revision' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Spaced Repetition & Active Recall Desk</h3>
                      <p className="text-xs text-slate-500">Scheduled retrieval cues (Day 1, 3, 7, 14, 30) for high-yield retention.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded border border-emerald-200">
                      Card {flashcardIndex + 1} of {FLASHCARDS.length}
                    </span>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
                    <div className="space-y-2">
                      <span className="font-bold text-amber-700 uppercase tracking-wide text-[10px]">Active Recall Question:</span>
                      <h4 className="text-sm font-bold text-slate-800 leading-relaxed">{FLASHCARDS[flashcardIndex].q}</h4>
                    </div>

                    {showFlashcardAnswer ? (
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-slate-800 space-y-2 leading-relaxed">
                        <strong className="block text-emerald-950 font-bold">Answer & Key Points:</strong>
                        <p className="whitespace-pre-line font-mono text-[11px]">{FLASHCARDS[flashcardIndex].a}</p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowFlashcardAnswer(true)} 
                        className="px-4 py-2 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 transition"
                      >
                        Show Answer & Recall Benchmark
                      </button>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <button 
                        onClick={() => {
                          setShowFlashcardAnswer(false);
                          setFlashcardIndex((flashcardIndex + 1) % FLASHCARDS.length);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-700 transition"
                      >
                        Next Flashcard →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. TOPIC NOTES & CITATIONS REPOSITORY */}
              {activeTab === 'notes-desk' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Topic Notes & Case Law Citations</h3>
                      <p className="text-xs text-slate-500">Store concise high-yield notes, thinker quotes, and constitutional case citations.</p>
                    </div>
                  </div>

                  {/* Add Note Form */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
                    <h4 className="font-bold text-slate-800 text-sm">Add New High-Yield Revision Note</h4>
                    <input 
                      type="text" 
                      placeholder="Note Title / Judgement / Theory..." 
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="w-full border rounded p-2 text-slate-800 font-semibold"
                    />
                    <textarea 
                      placeholder="Concise micro-summary, articles, committee names..." 
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full h-24 border rounded p-2 text-slate-800 font-mono"
                    />
                    <div className="flex justify-end">
                      <button onClick={addNote} className="px-4 py-1.5 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 transition">
                        Save to Repository
                      </button>
                    </div>
                  </div>

                  {/* Existing Notes */}
                  <div className="space-y-3">
                    {personalNotes.map(n => (
                      <div key={n.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-slate-800 text-sm">{n.title}</h5>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold border border-purple-200">{n.tag}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-mono text-[11px]">{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 10. GS FOUNDATION */}
              {activeTab === 'gs-planner' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-base">General Studies Foundation (GS I–IV)</h3>
                    <p className="text-xs text-slate-500">Core standard reference books, NCERT foundations, and subtopic checklist.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <h4 className="font-bold text-blue-900">GS-1: History, Heritage & Geography</h4>
                      <p className="text-slate-500 font-serif">Spectrum, Nitin Singhania, GC Leong, Class 11 NCERT</p>
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">5 Modules Tracked</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <h4 className="font-bold text-blue-900">GS-2: Polity, Constitution & Governance</h4>
                      <p className="text-slate-500 font-serif">M. Laxmikanth (7th Ed), 2nd ARC Reports, PRS India</p>
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">5 Modules Tracked</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <h4 className="font-bold text-blue-900">GS-3: Economy, Agriculture & Environment</h4>
                      <p