// fix.js — Restores all missing screens in app/page.tsx
const fs = require('fs');
const path = require('path');

const pageCode = `'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Target, Map as MapIcon, BookOpen, Globe, 
  FileText, HelpCircle, Edit3, CheckCircle, Clock, RotateCcw, 
  BookMarked, Brain, Award, Sparkles, Filter
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<any[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [currentAffairs, setCurrentAffairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mains Lab State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  // PYQ Interactive State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    async function loadData() {
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
        console.error('Error fetching data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Timer Tick for Mains Writing
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED' } : t));
  };

  const evaluateAnswer = async () => {
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
      alert('Evaluation call failed. Check server connection.');
    } finally {
      setEvaluating(false);
    }
  };

  const rebalanceSchedule = async () => {
    const res = await fetch('/api/schedule/rebalance', { method: 'POST' });
    const data = await res.json();
    alert(data.message || 'Schedule rebalanced successfully.');
  };

  // Safe today tasks calculation (fallback to first scheduled day if empty)
  const todayStr = new Date().toISOString().split('T')[0];
  const matchingToday = tasks.filter(t => t.scheduledDate === todayStr);
  const todayTasks = matchingToday.length > 0 ? matchingToday : tasks.slice(0, 3);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 flex flex-col flex-shrink-0 z-20 select-none">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
            IAS
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">UPSC Master</h1>
            <p className="text-[11px] text-amber-400 font-medium">GS + PSIR • CSE 2027</p>
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
            <Target className="w-4 h-4 text-emerald-400" /> Today's Plan
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
            onClick={() => setActiveTab('mains-answer')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'mains-answer' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <Edit3 className="w-4 h-4 text-rose-400" /> Mains Answer Writing
          </button>

          <button 
            onClick={() => setActiveTab('current-affairs')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'current-affairs' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <FileText className="w-4 h-4 text-teal-400" /> Current Affairs
          </button>

          <button 
            onClick={() => setActiveTab('pyq')} 
            className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium transition \${activeTab === 'pyq' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" /> Verified PYQs
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

      {/* Main Container */}
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
          <button 
            onClick={rebalanceSchedule} 
            className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 flex items-center gap-1.5 shadow-sm transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Rebalance Overdue Schedule
          </button>
        </header>

        {/* Content View Router */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <Clock className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
              Loading verified UPSC preparation repository...
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD VIEW */}
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
                            onClick={() => toggleTask(t.id)} 
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

              {/* 2. TODAY'S STUDY PLAN VIEW (Previously blank) */}
              {activeTab === 'today' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Productive Routine: 8 Hours Structured</span>
                      <h3 className="text-lg font-bold text-slate-800">Today's Actionable Agenda & Study Instructions</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Syllabus-mapped readings, concrete objectives, and key concept extractions.</p>
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
                              onClick={() => toggleTask(t.id)} 
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

              {/* 3. COMPLETE PLAN VIEWER */}
              {activeTab === 'complete-plan' && (
                <div className="space-y-4 max-w-6xl mx-auto">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Complete Date-wise Preparation Roadmap</h3>
                      <p className="text-xs text-slate-500">From Today through Prelims (23 May 2027) and Mains (20 August 2027)</p>
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
                        {tasks.slice(0, 40).map((t) => (
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

              {/* 4. VERIFIED PYQ PRACTICE VIEW (Previously blank) */}
              {activeTab === 'pyq' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">UPSC Official PYQ Practice Engine</h3>
                      <p className="text-xs text-slate-500">Genuine commission questions with official answer keys and elimination notes.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded border border-amber-200">
                      Verified PYQ Bank
                    </span>
                  </div>

                  <div className="space-y-4">
                    {pyqs.map(p => {
                      const options = p.optionsJson ? JSON.parse(p.optionsJson) : [];
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
                              {options.map((opt: any) => (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    setSelectedOption(opt.id);
                                    setShowExplanation(true);
                                  }}
                                  className={\`w-full p-2.5 rounded border text-left flex items-center gap-2 transition \${
                                    selectedOption === opt.id 
                                      ? opt.id === p.correctOption 
                                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold' 
                                        : 'bg-rose-100 border-rose-400 text-rose-900'
                                      : 'hover:bg-slate-50 text-slate-700 border-slate-200'
                                  }\`}
                                >
                                  <span className="font-bold">{opt.id})</span> {opt.text}
                                </button>
                              ))}
                            </div>
                          )}

                          {showExplanation && p.explanation && (
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

              {/* 5. CURRENT AFFAIRS VIEW (Previously blank) */}
              {activeTab === 'current-affairs' && (
                <div className="space-y-5 max-w-4xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Verified Current Affairs & Static Mapping</h3>
                      <p className="text-xs text-slate-500">Live developments from PIB, MEA, and The Hindu mapped directly to GS & PSIR topics.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-800 font-bold text-xs rounded border border-teal-200">
                      Synchronised Feeds
                    </span>
                  </div>

                  <div className="space-y-4">
                    {currentAffairs.map(item => (
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
                          <span className="text-blue-600 font-semibold">Official Release Tagged</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. MAINS ANSWER WRITING & EVALUATION */}
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

              {/* 7. GS FOUNDATION PLANNER */}
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
                      <p className="text-slate-500 font-serif">Economic Survey, Shankar IAS/PMF IAS, Budget 2026</p>
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">5 Modules Tracked</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <h4 className="font-bold text-blue-900">GS-4: Ethics, Integrity & Aptitude</h4>
                      <p className="text-slate-500 font-serif">Lexicon for Ethics, 2nd ARC 4th Report, Applied Case Studies</p>
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">4 Modules Tracked</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. PSIR OPTIONAL PLANNER */}
              {activeTab === 'psir-planner' && (
                <div className="space-y-5 max-w-5xl mx-auto">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-base">PSIR Optional Dedicated Command Centre</h3>
                    <p className="text-xs text-slate-500">Political Theory, Indian Government & Politics, Comparative Politics, and India's Foreign Policy.</p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
                    <h4 className="font-bold text-slate-800 text-sm">Thinker Comparison Matrix: Theories of Justice</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-200 text-left">
                        <thead className="bg-slate-50 font-bold text-slate-800">
                          <tr>
                            <th className="border p-2.5">Thinker</th>
                            <th className="border p-2.5">Tradition</th>
                            <th className="border p-2.5">Core Thesis</th>
                            <th className="border p-2.5">Primary Work</th>
                            <th className="border p-2.5">Key Critique</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-700">
                          <tr>
                            <td className="border p-2.5 font-bold">John Rawls</td>
                            <td className="border p-2.5">Deontological Liberalism</td>
                            <td className="border p-2.5">Justice as Fairness (Veil of Ignorance & Difference Principle)</td>
                            <td className="border p-2.5 italic">A Theory of Justice (1971)</td>
                            <td className="border p-2.5">Nozick, Sen, Sandel</td>
                          </tr>
                          <tr>
                            <td className="border p-2.5 font-bold">Robert Nozick</td>
                            <td className="border p-2.5">Libertarianism</td>
                            <td className="border p-2.5">Entitlement Theory (Historical principles in acquisition & transfer)</td>
                            <td className="border p-2.5 italic">Anarchy, State, and Utopia</td>
                            <td className="border p-2.5">G.A. Cohen (Marxist)</td>
                          </tr>
                          <tr>
                            <td className="border p-2.5 font-bold">Amartya Sen</td>
                            <td className="border p-2.5">Capability Approach</td>
                            <td className="border p-2.5">Realisation-focused comparison (Nyaya over transcendental Niti)</td>
                            <td className="border p-2.5 italic">The Idea of Justice (2009)</td>
                            <td className="border p-2.5">Transcendental Institutionalists</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'app/page.tsx'), pageCode, 'utf8');
console.log('✓ app/page.tsx updated successfully with all 8 complete views!');