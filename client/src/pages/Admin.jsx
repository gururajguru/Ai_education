import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ShieldAlert, Settings, RefreshCw, Activity, AlertTriangle, 
  ToggleLeft, ToggleRight, Sparkles, Server, Database, Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MOCK_GRAPH_DATA = [
  { time: '12:00', requests: 45, latency: 120 },
  { time: '13:00', requests: 88, latency: 140 },
  { time: '14:00', requests: 120, latency: 190 },
  { time: '15:00', requests: 160, latency: 170 },
  { time: '16:00', requests: 210, latency: 150 },
  { time: '17:00', requests: 310, latency: 160 },
  { time: '18:00', requests: 280, latency: 130 }
];

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [systemToggles, setSystemToggles] = useState({
    aiChatbot: true,
    spacedRep: true,
    studyRoom: true,
    assignments: true,
    mockDb: true,
    notifications: true
  });

  const handleToggle = (key, label) => {
    const nextVal = !systemToggles[key];
    setSystemToggles(prev => ({ ...prev, [key]: nextVal }));

    // Sound/Confetti trigger
    if (nextVal) {
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#a855f7']
      });
    }
  };

  const triggerReset = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
      {/* Left Column: Systems Control Dashboard Toggles */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Futuristic Toggle Switch Hub */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-400/5 rounded-full filter blur-xl animate-pulse-glow" />
          
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Server className="h-6 w-6 text-cyan-400 animate-pulse" />
              <span className="text-base font-bold tracking-wider text-slate-200 uppercase font-sans">Core LMS Subsystem Switches</span>
            </div>
            <button 
              onClick={triggerReset}
              className="px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-800 text-xs font-black uppercase text-cyan-400 hover:bg-cyan-950 flex items-center gap-2 transition-colors"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Reset Caches
            </button>
          </div>

          {/* Toggle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Toggle Card 1 */}
            <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between hover:border-cyan-500/20 transition-all">
              <div className="space-y-1.5 pr-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-400" /> AI Core Engine
                </span>
                <h4 className="text-sm font-black text-slate-200">Gemini LLM Tutor</h4>
                <p className="text-xs text-slate-400 leading-normal">Toggles real-time chatbot prompts and study mode calibrations.</p>
              </div>
              <button 
                onClick={() => handleToggle('aiChatbot', 'Gemini LLM Tutor')}
                className={`p-1.5 rounded-xl transition-all duration-200 hover:scale-105 ${systemToggles.aiChatbot ? 'text-cyan-400' : 'text-slate-600'}`}
              >
                {systemToggles.aiChatbot ? <ToggleRight size={40} className="stroke-[1.5]" /> : <ToggleLeft size={40} className="stroke-[1.5]" />}
              </button>
            </div>

            {/* Toggle Card 2 */}
            <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between hover:border-cyan-500/20 transition-all">
              <div className="space-y-1.5 pr-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Brain size={12} className="text-cyan-400" /> Diagnostics
                </span>
                <h4 className="text-sm font-black text-slate-200">Memory Decay Curves</h4>
                <p className="text-xs text-slate-400 leading-normal">Toggles spaced repetition active recall questions dashboard.</p>
              </div>
              <button 
                onClick={() => handleToggle('spacedRep', 'Memory Decay Curves')}
                className={`p-1.5 rounded-xl transition-all duration-200 hover:scale-105 ${systemToggles.spacedRep ? 'text-cyan-400' : 'text-slate-600'}`}
              >
                {systemToggles.spacedRep ? <ToggleRight size={40} className="stroke-[1.5]" /> : <ToggleLeft size={40} className="stroke-[1.5]" />}
              </button>
            </div>

            {/* Toggle Card 3 */}
            <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between hover:border-cyan-500/20 transition-all">
              <div className="space-y-1.5 pr-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Database size={12} className="text-purple-400" /> Database Sync
                </span>
                <h4 className="text-sm font-black text-slate-200">Mock Ledger Syncing</h4>
                <p className="text-xs text-slate-400 leading-normal">Toggles state synchronization with backend Node/Express proxy.</p>
              </div>
              <button 
                onClick={() => handleToggle('mockDb', 'Mock Ledger Syncing')}
                className={`p-1.5 rounded-xl transition-all duration-200 hover:scale-105 ${systemToggles.mockDb ? 'text-cyan-400' : 'text-slate-600'}`}
              >
                {systemToggles.mockDb ? <ToggleRight size={40} className="stroke-[1.5]" /> : <ToggleLeft size={40} className="stroke-[1.5]" />}
              </button>
            </div>

            {/* Toggle Card 4 */}
            <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between hover:border-cyan-500/20 transition-all">
              <div className="space-y-1.5 pr-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldAlert size={12} className="text-rose-400" /> Curriculum
                </span>
                <h4 className="text-sm font-black text-slate-200">Assignments Engine</h4>
                <p className="text-xs text-slate-400 leading-normal">Toggles student solution submissions and teacher grading forms.</p>
              </div>
              <button 
                onClick={() => handleToggle('assignments', 'Assignments Engine')}
                className={`p-1.5 rounded-xl transition-all duration-200 hover:scale-105 ${systemToggles.assignments ? 'text-cyan-400' : 'text-slate-600'}`}
              >
                {systemToggles.assignments ? <ToggleRight size={40} className="stroke-[1.5]" /> : <ToggleLeft size={40} className="stroke-[1.5]" />}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Right Column: API Metrics & Curricular Settings */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Live Traffic Monitor */}
        <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
            <Activity className="h-4.5 w-4.5 text-cyan-400" /> Live Gateway Request Load
          </h3>

          <div className="w-full h-[140px] mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_GRAPH_DATA}>
                <defs>
                  <linearGradient id="reqGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0a0624', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  itemStyle={{ color: '#00f2fe', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#reqGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Config Settings */}
        <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Settings className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-bold tracking-wider text-slate-200 uppercase font-sans">LMS Global Weights</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Pedagogical Threshold Rate</label>
              <input 
                type="range"
                min={50}
                max={95}
                defaultValue={78}
                className="w-full accent-cyan-400 bg-white/10 rounded-lg cursor-pointer h-1.5 mt-2"
              />
              <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
                <span>50% (Lenient)</span>
                <span>95% (Extreme)</span>
              </div>
            </div>

            <div className="p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-xl flex gap-2 text-xs font-mono text-cyan-400 leading-normal">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
              <span>Calibrated weights configure the prompt structure of adaptive quizzes and LLM tutoring layers dynamically.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
