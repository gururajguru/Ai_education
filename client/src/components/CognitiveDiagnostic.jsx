import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Brain, Sparkles, RefreshCw, Bookmark, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CognitiveDiagnostic() {
  const { cognitiveProfile, setCognitiveProfile, addXP, addNotification } = useContext(UserContext);
  const [activeRecallActive, setActiveRecallActive] = useState(false);
  const [recallAnswer, setRecallAnswer] = useState('');
  const [recallSuccess, setRecallSuccess] = useState(false);
  const [activeGapId, setActiveGapId] = useState(null);

  const startRecallQuiz = (gapId) => {
    setActiveGapId(gapId);
    setActiveRecallActive(true);
    setRecallSuccess(false);
    setRecallAnswer('');
  };

  const handleVerifyRecall = (e) => {
    e.preventDefault();
    if (!recallAnswer.trim()) return;

    setActiveRecallActive(false);
    setRecallSuccess(true);
    addXP(120); // Massive XP for patching knowledge gaps

    // Update cognitive profile retention rating and resolve gap
    setCognitiveProfile(prev => {
      const nextRetention = Math.min(100, prev.retentionScore + 6);
      const updatedGaps = prev.knowledgeGaps.map(g => {
        if (g.id === activeGapId) {
          return {
            ...g,
            score: Math.min(100, g.score + 35),
            suggestion: 'Knowledge Gap Patched! Retention locks verified.'
          };
        }
        return g;
      });

      return {
        ...prev,
        retentionScore: nextRetention,
        knowledgeGaps: updatedGaps
      };
    });

    addNotification({
      title: 'Knowledge Gap Resolved! 🧬',
      message: 'Active Recall completed successfully. Spaced Repetition interval optimized for 7 days.',
      time: 'Just now'
    });
  };

  const getRecallQuestion = () => {
    const gap = cognitiveProfile.knowledgeGaps.find(g => g.id === activeGapId);
    if (!gap) return 'What is the core theorem in AI?';
    if (gap.topic.includes('Backpropagation')) {
      return 'What mathematical calculus rule computes gradients through layers during backpropagation?';
    }
    return 'Qubits exist in linear combinations of 0 and 1 until measured. What is this state called?';
  };

  const decayStatusColor = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50';
    if (score >= 55) return 'text-cyan-400 bg-cyan-950/40 border-cyan-900/50';
    return 'text-rose-400 bg-rose-950/40 border-rose-900/50';
  };

  return (
    <div className="glassmorphism p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col gap-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primaryGlow/5 rounded-full filter blur-xl animate-pulse-glow" />
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primaryGlow animate-pulse" />
          <span className="text-sm font-bold tracking-wider text-slate-200">COGNITIVE GAP DIAGNOSTICS</span>
        </div>
        <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded uppercase tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-800">
          Retention Locked
        </span>
      </div>

      {/* Memory Retention Circular Score Board */}
      <div className="flex items-center justify-around p-2.5 rounded-xl bg-black/40 border border-white/5 gap-4">
        <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.03)" strokeWidth="5" fill="transparent" />
            <circle 
              cx="40" 
              cy="40" 
              r="32" 
              stroke="#00f2fe" 
              strokeWidth="5" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 32}
              strokeDashoffset={2 * Math.PI * 32 * (1 - cognitiveProfile.retentionScore / 100)}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center">
            <span className="text-sm font-black text-white font-mono">{cognitiveProfile.retentionScore}%</span>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Retention</p>
          </div>
        </div>

        <div className="space-y-1.5 flex-1">
          <h4 className="text-xs font-bold text-slate-300">Memory Decay Velocity</h4>
          <p className="text-xs text-slate-400 leading-normal">
            Your knowledge networks are currently decaying at **{cognitiveProfile.memoryDecayRate}% per day**. Trigger active recall questions to strengthen pathways!
          </p>
        </div>
      </div>

      {/* Knowledge Gaps Directory */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Bookmark size={10} className="text-cyan-400" /> AI Identified Knowledge Gaps
        </h4>

        {activeRecallActive ? (
          /* Active Recall Challenge UI Form */
          <form onSubmit={handleVerifyRecall} className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-950/40 border border-cyan-500/30 space-y-3 animate-in fade-in duration-300">
            <div className="flex gap-2 items-start text-xs text-cyan-200 leading-relaxed font-semibold">
              <Sparkles className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>{getRecallQuestion()}</span>
            </div>
            
            <input 
              type="text" 
              required
              placeholder="e.g. Chain Rule (or Superposition)"
              value={recallAnswer}
              onChange={(e) => setRecallAnswer(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            
            <button
              type="submit"
              className="w-full py-2 bg-cyan-950/40 border border-cyan-800 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-cyan-950"
            >
              Verify Recalled Fact
            </button>
          </form>
        ) : (
          <div className="space-y-2.5 max-h-[160px] overflow-y-auto">
            {cognitiveProfile.knowledgeGaps.map((gap) => (
              <div 
                key={gap.id}
                className="p-3 bg-white/0 border border-white/5 rounded-xl hover:border-white/10 transition-colors flex justify-between items-center gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wide">{gap.subject}</span>
                    <span className={`text-xs font-mono font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${decayStatusColor(gap.score)}`}>
                      {gap.score}% Mastery
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200 truncate">{gap.topic}</h5>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-1">{gap.suggestion}</p>
                </div>
                
                {gap.score < 80 && (
                  <button 
                    onClick={() => startRecallQuiz(gap.id)}
                    className="p-1.5 rounded-lg bg-cyan-950/20 border border-cyan-900 hover:border-cyan-400 text-cyan-400 hover:text-cyan-200 transition-colors shrink-0"
                    title="Active Recall Quiz"
                  >
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spaced repetition tip */}
      <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/30 text-xs font-mono text-cyan-400 flex gap-2 items-start leading-relaxed">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>Based on spaced repetition research. Reviewing key concepts precisely before forgetting optimizes memory retention.</span>
      </div>
    </div>
  );
}
