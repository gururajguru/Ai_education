import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { LearningContext } from '../context/LearningContext';
import CognitiveDiagnostic from '../components/CognitiveDiagnostic';
import confetti from 'canvas-confetti';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  BookOpen, Sparkles, Trophy, BrainCircuit, Hourglass, Zap, Flame, ShieldCheck, CheckCircle2 
} from 'lucide-react';

const MOCK_GRAPH_DATA = [
  { day: 'Mon', xp: 120, mins: 30 },
  { day: 'Tue', xp: 240, mins: 45 },
  { day: 'Wed', xp: 320, mins: 25 },
  { day: 'Thu', xp: 450, mins: 60 },
  { day: 'Fri', xp: 580, mins: 50 },
  { day: 'Sat', xp: 750, mins: 80 },
  { day: 'Sun', xp: 900, mins: 90 }
];

const LEADERBOARD = [
  { name: 'Alex H.', xp: 2450, level: 5, streak: 8, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80', active: false },
  { name: 'Sophia M.', xp: 2210, level: 4, streak: 12, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80', active: true },
  { name: 'You', xp: 900, level: 2, streak: 3, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', active: false },
  { name: 'Marcus L.', xp: 880, level: 2, streak: 6, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80', active: false }
];

const CLASS_CODE_MAP = {
  'VANCE-101': {
    teacher: 'Dr. Evelyn Vance',
    subject: 'Advanced Neural Networks & Deep Learning'
  },
  'STERLING-202': {
    teacher: 'Professor Marcus Sterling',
    subject: 'Modern Quantum Computing Fundamentals'
  },
  'EDGE-303': {
    teacher: 'Professor Marcus Sterling',
    subject: 'Full-Stack Edge Architectures & WebRTC'
  }
};

export default function Dashboard({ setCurrentPage }) {
  const { user, setUser, addXP, addNotification } = useContext(UserContext);
  const { courses, announcements } = useContext(LearningContext);

  const [classCodeInput, setClassCodeInput] = useState('');
  const [classConnectionError, setClassConnectionError] = useState('');

  const handleActivateStreak = () => {
    setUser(prev => ({ ...prev, streak: 1 }));
    addXP(50);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#fb923c', '#ffedd5', '#8a2be2']
    });
    addNotification({
      title: 'Daily Streak Started! 🔥',
      message: 'You have activated your 1-Day daily study streak and earned +50 XP!',
      time: 'Just now'
    });
  };

  const handleConnectClass = (e) => {
    e.preventDefault();
    const cleanCode = classCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setClassConnectionError('Please enter a class code.');
      return;
    }

    if (CLASS_CODE_MAP[cleanCode]) {
      setUser(prev => ({ ...prev, classCode: cleanCode }));
      setClassConnectionError('');
      setClassCodeInput('');
      
      confetti({
        particleCount: 60,
        spread: 45,
        origin: { y: 0.8 }
      });

      addNotification({
        title: 'Classroom Connected! 🏫',
        message: `Successfully connected to ${CLASS_CODE_MAP[cleanCode].teacher}'s class [${cleanCode}].`,
        time: 'Just now'
      });
    } else {
      setClassConnectionError(`Invalid Class Code. Please try VANCE-101 or STERLING-202.`);
    }
  };

  const handleDisconnectClass = () => {
    const code = user.classCode;
    setUser(prev => {
      const copy = { ...prev };
      delete copy.classCode;
      return copy;
    });
    
    addNotification({
      title: 'Classroom Disconnected 🔌',
      message: `You disconnected from [${code}] course portal.`,
      time: 'Just now'
    });
  };

  // Analyze Weak Subjects & Custom Recommendations based on user lessons complete
  const getAIRecommendations = () => {
    const incompleteCourses = courses.filter(c => c.progress < 100);
    if (incompleteCourses.length === 0) {
      return {
        suggestion: 'You have mastered all primary courses!',
        weakArea: 'None identified.'
      };
    }
    
    const targetCourse = incompleteCourses[0];
    const weakSubject = targetCourse.subject;
    const lesson = targetCourse.lessons.find(l => !l.completed) || targetCourse.lessons[0];

    return {
      courseId: targetCourse.id,
      title: targetCourse.title,
      weakArea: `Performance analytics and quiz results suggest unfamiliarity with **${weakSubject}** (${lesson.title}).`,
      suggestion: `Tackle **${lesson.title}** inside Smart Courses next to earn 150 XP, or ask the AI Tutor: *"Simplify ${lesson.title}"*.`
    };
  };

  const aiRec = getAIRecommendations();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Welcome Panel */}
      <div className="glassmorphism p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primaryGlow/5 rounded-full filter blur-xl animate-pulse-glow" />
        <div className="flex items-center gap-4">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="h-14 w-14 rounded-2xl object-cover border border-white/10 shadow-neon-purple shrink-0" 
          />
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-wide uppercase">
              Welcome back, {user.name}!
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Learning pathway customized for: <strong className="text-cyan-400 font-bold uppercase">[{user.learningMode} Mode]</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentPage('tutor')}
            className="px-4 py-2 bg-gradient-to-r from-neonPurple to-pink-600 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-neon-purple hover:scale-102 transition-transform"
          >
            Launch AI Tutor
          </button>
        </div>
      </div>

      {/* Grid Stats counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glassmorphism p-4 rounded-2xl border border-white/5 flex items-center gap-3.5 relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-200">
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 shrink-0">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total XP</p>
            <h3 className="text-lg font-black font-mono text-cyan-300 mt-0.5">{user.xp} XP</h3>
          </div>
        </div>

        <div className="glassmorphism p-4 rounded-2xl border border-white/5 flex items-center gap-3.5 relative overflow-hidden group hover:border-purple-500/20 transition-all duration-200">
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/30 text-neonPurple shrink-0">
            <Trophy size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Badges Earned</p>
            <h3 className="text-lg font-black font-mono text-purple-300 mt-0.5">
              {user.badges.filter(b => b.unlocked).length} / {user.badges.length}
            </h3>
          </div>
        </div>

        <div className="glassmorphism p-4 rounded-2xl border border-white/5 flex items-center gap-3.5 relative overflow-hidden group hover:border-pink-500/20 transition-all duration-200">
          <div className="p-2.5 rounded-xl bg-pink-950/40 border border-pink-800/30 text-neonPink shrink-0">
            <Hourglass size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Study Time</p>
            <h3 className="text-lg font-black font-mono text-pink-300 mt-0.5">{user.studyTime} Mins</h3>
          </div>
        </div>

        <div className="glassmorphism p-4 rounded-2xl border border-white/5 flex items-center gap-3.5 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-200">
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 shrink-0">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Courses</p>
            <h3 className="text-lg font-black font-mono text-emerald-300 mt-0.5">
              {courses.filter(c => c.progress > 0).length} Enrolled
            </h3>
          </div>
        </div>

      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recharts Data and AI Diagnostics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Starting Study Streak Card */}
          {user.streak === 0 && (
            <div className="glassmorphism p-5 rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-950/20 via-black/30 to-orange-950/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/5 rounded-full filter blur-xl animate-pulse" />
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-800/30 text-orange-400 animate-pulse">
                  <Flame size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-100 uppercase tracking-wide">
                    Start Your Daily Study Streak!
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                    Start your daily study streak to build active learning habits, keep your retention rates high, and claim a starting bonus of +50 XP!
                  </p>
                </div>
              </div>
              <button
                onClick={handleActivateStreak}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-neon-orange hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
              >
                Activate 1-Day Streak (+50 XP)
              </button>
            </div>
          )}

          {/* Performance AreaChart */}
          <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="h-4.5 w-4.5 text-cyan-400" /> Learning Performance Curves
            </h3>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_GRAPH_DATA}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0a0624', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '12px' }}
                    itemStyle={{ color: '#00f2fe', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="xp" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendation Engine card */}
          <div className="glassmorphism p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-950/20 via-black/20 to-cyan-950/10 flex flex-col gap-4 relative">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-400/5 rounded-full filter blur-xl animate-pulse-glow" />
            <h3 className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-neonPurple uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              AI Study Recommendations
            </h3>

            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs font-black text-rose-400 uppercase tracking-widest">Learning Diagnostic Alert</span>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: aiRec.weakArea }} />
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/40">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Smart Study Suggestion</span>
                <p className="text-xs text-cyan-100 mt-1 leading-relaxed">{aiRec.suggestion}</p>
              </div>
            </div>

            {aiRec.courseId && (
              <button 
                onClick={() => setCurrentPage('courses')}
                className="w-full py-2 bg-gradient-to-r from-primaryGlow to-secondaryGlow rounded-xl text-xs font-bold uppercase text-white shadow-neon-cyan tracking-wider hover:opacity-95 mt-1"
              >
                Go to Recommended Material
              </button>
            )}
          </div>

        </div>

        {/* Right Column: Emotion Toggles & Leaderboards */}
        <div className="space-y-6">
          
          {/* Cognitive Diagnostics Engine */}
          <CognitiveDiagnostic />

          {/* Classroom Connection Widget */}
          <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-xl" />
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 animate-pulse" /> Classroom Connection
            </h3>
            
            {user.classCode ? (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-left relative overflow-hidden">
                  <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                    Connected
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Active Class Enrolled</span>
                  <h4 className="text-xs font-bold text-slate-200 mt-1">{CLASS_CODE_MAP[user.classCode]?.subject || 'Classroom Portal'}</h4>
                  <div className="text-xs text-slate-400 mt-2 space-y-1">
                    <p><strong className="text-slate-300">Instructor:</strong> {CLASS_CODE_MAP[user.classCode]?.teacher || 'Faculty Educator'}</p>
                    <p><strong className="text-slate-300">Class Code:</strong> <code className="bg-black/40 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-[10px]">{user.classCode}</code></p>
                  </div>
                </div>
                <button 
                  onClick={handleDisconnectClass}
                  className="w-full py-2 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-900/40 hover:border-rose-800/50 rounded-xl text-xs font-bold uppercase text-rose-300 hover:text-rose-200 tracking-wider transition-colors duration-200"
                >
                  Disconnect from Class
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 text-left">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect to your respective instructor's class code to sync course schedules, direct assignments, and faculty grades.
                </p>
                
                <form onSubmit={handleConnectClass} className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text"
                      value={classCodeInput}
                      onChange={(e) => {
                        setClassCodeInput(e.target.value.toUpperCase());
                        setClassConnectionError('');
                      }}
                      placeholder="Enter class code (e.g., VANCE-101)"
                      className="w-full bg-black/60 border border-white/10 text-xs rounded-xl pl-3 pr-3 py-2.5 focus:outline-none focus:border-emerald-500/50 text-white tracking-wide placeholder-slate-500 uppercase font-mono"
                    />
                  </div>

                  {classConnectionError && (
                    <p className="text-[11px] font-bold text-rose-400 mt-0.5">
                      ⚠️ {classConnectionError}
                    </p>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-xs font-black uppercase text-white shadow-neon-emerald tracking-wider hover:opacity-95"
                  >
                    Connect Classroom Code
                  </button>
                </form>

                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Available Test Class Codes:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(CLASS_CODE_MAP).map((code) => (
                      <button
                        key={code}
                        onClick={() => {
                          setClassCodeInput(code);
                          setClassConnectionError('');
                        }}
                        className="p-2 bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-950/10 rounded-xl text-left transition-all duration-200 group"
                      >
                        <code className="text-[10px] font-bold text-emerald-400 font-mono group-hover:text-emerald-300">{code}</code>
                        <p className="text-[9px] text-slate-500 truncate group-hover:text-slate-400 mt-0.5">
                          {CLASS_CODE_MAP[code].teacher.split(' ')[2]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Teacher Announcements Feed */}
          <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2 font-sans">
              <BookOpen className="h-4.5 w-4.5 text-cyan-400 animate-pulse" /> Curricular Announcements
            </h3>
            <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
              {!announcements || announcements.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4 font-mono">No active bulletins posted.</p>
              ) : (
                announcements.map((ann) => (
                  <div key={ann.id} className="p-3.5 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors space-y-1.5 relative">
                    <span className="text-xs font-black text-rose-400 uppercase tracking-widest block">{ann.author}</span>
                    <h4 className="text-xs font-bold text-slate-200">{ann.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{ann.content}</p>
                    <span className="text-xs text-slate-500 font-mono block mt-1">{ann.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mini Leaderboards */}
          <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="h-4.5 w-4.5 text-amber-400" /> Student Leaderboard
            </h3>
            
            <div className="space-y-2.5">
              {LEADERBOARD.map((mate, i) => {
                const isMe = mate.name === 'You';
                return (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-2 rounded-xl border ${
                      isMe 
                        ? 'bg-gradient-to-r from-neonPurple/20 to-indigo-950/20 border-neonPurple/40 shadow-neon-purple' 
                        : 'bg-white/0 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-xs font-black text-slate-500 font-mono w-4">#{i + 1}</span>
                      <img 
                        src={isMe ? user.avatar : mate.avatar} 
                        alt={mate.name} 
                        className="h-8 w-8 rounded-full object-cover border border-white/10" 
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{isMe ? user.name : mate.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Level {isMe ? user.level : mate.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-300 font-mono">{isMe ? user.xp : mate.xp} XP</span>
                      <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-0.5 justify-end">
                        🔥 {isMe ? user.streak : mate.streak} Days
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
