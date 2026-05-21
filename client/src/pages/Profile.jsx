import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import FlashcardDeck from '../components/FlashcardDeck';
import { Award, Zap, Flame, Hourglass } from 'lucide-react';

export default function Profile() {
  const { user } = useContext(UserContext);
  const role = user?.role || 'Student';

  // Get dynamic stats based on role
  let stats = [];
  if (role === 'Student') {
    stats = [
      { label: 'Academic XP', value: `${user.xp} XP`, sub: `Level ${user.level}`, color: 'text-cyan-400', icon: Zap },
      { label: 'Daily Streak', value: `${user.streak} Days`, sub: 'Peak Study Frequency', color: 'text-orange-400', icon: Flame },
      { label: 'Time Invested', value: `${user.studyTime} Mins`, sub: 'Active study sessions', color: 'text-pink-400', icon: Hourglass }
    ];
  } else if (role === 'Teacher') {
    const registeredStudents = JSON.parse(localStorage.getItem('registered_students') || '[]');
    const totalStudents = 12 + registeredStudents.length;
    stats = [
      { label: 'Classes Managed', value: '3 Classes', sub: 'Primary Gradebook', color: 'text-indigo-400', icon: Zap },
      { label: 'Total Students', value: `${totalStudents} Students`, sub: 'Active Registry', color: 'text-cyan-400', icon: Flame },
      { label: 'Assigned Courses', value: '4 Courses', sub: 'Curriculum Standards', color: 'text-pink-400', icon: Hourglass }
    ];
  } else {
    // Admin
    stats = [
      { label: 'System Health', value: '99.9% Uptime', sub: 'All systems operational', color: 'text-rose-400', icon: Zap },
      { label: 'Active Sessions', value: '1,280 Sessions', sub: 'Past 24 hours log', color: 'text-amber-400', icon: Flame },
      { label: 'Security Status', value: 'Verified', sub: 'RS256 JWT Active', color: 'text-emerald-400', icon: Hourglass }
    ];
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
      {/* Left panel: Achievements & Stats */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Profile Card details */}
        <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-3.5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-xl animate-pulse-glow" />
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="h-20 w-20 rounded-2xl object-cover border-2 border-neonPurple shadow-neon-purple mt-2" 
          />
          <div>
            <h3 className="text-base font-black text-slate-100 uppercase tracking-wide">{user.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
          </div>
          {role === 'Student' ? (
            <div className="flex flex-col gap-1.5 items-center">
              <span className="px-3 py-1 bg-cyan-950/40 border border-cyan-800 text-cyan-400 text-xs font-black uppercase rounded tracking-wider">
                📖 {user.learningMode} Mode Active
              </span>
              {user.classCode && (
                <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-black uppercase rounded tracking-wider shadow-neon-emerald/30 animate-pulse">
                  🏫 Connected: {user.classCode}
                </span>
              )}
            </div>
          ) : role === 'Teacher' ? (
            <span className="px-3 py-1 bg-indigo-950/40 border border-indigo-800 text-indigo-400 text-xs font-black uppercase rounded tracking-wider">
              🏫 Faculty Educator
            </span>
          ) : (
            <span className="px-3 py-1 bg-rose-950/40 border border-rose-800 text-rose-400 text-xs font-black uppercase rounded tracking-wider">
              ⚙️ System Administrator
            </span>
          )}
        </div>

        {/* Stats metrics */}
        <div className="space-y-2.5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="glassmorphism p-3.5 rounded-2xl border border-white/5 flex items-center gap-3.5 hover:border-white/10 transition-colors"
              >
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <Icon size={16} className={stat.color} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  <h4 className="text-sm font-black text-slate-100 mt-0.5">{stat.value}</h4>
                  <span className="text-xs text-slate-400 block mt-0.5">{stat.sub}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right panel: Badges grid & Flashcard Desk or Educator/Admin Console details */}
      <div className="lg:col-span-2 space-y-6">
        
        {role === 'Student' ? (
          <>
            {/* Achievements badges grid */}
            <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-xl" />
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Award className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">ACCOMPLISHMENTS GALLERY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {user.badges.map((b) => (
                  <div 
                    key={b.id}
                    className={`p-3.5 rounded-2xl border flex gap-3.5 transition-all duration-300 ${
                      b.unlocked 
                        ? 'bg-amber-950/5 border-amber-500/35 shadow-[0_0_10px_rgba(245,158,11,0.1)] text-white' 
                        : 'bg-black/40 border-white/5 opacity-40 text-slate-500'
                    }`}
                  >
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-lg border ${
                      b.unlocked ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 animate-pulse' : 'bg-slate-900 border-white/5 text-slate-600'
                    }`}>
                      {b.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{b.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic 3D memory deck flashcards */}
            <FlashcardDeck />
          </>
        ) : role === 'Teacher' ? (
          <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-xl" />
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Award className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">Class Performance Overview</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Average Class Progress</h4>
                <p className="text-xl font-bold mt-1 text-emerald-400">84.2% Completion</p>
                <span className="text-xs text-slate-500">Up 2.4% from last week</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Active Assignments</h4>
                <p className="text-xl font-bold mt-1 text-cyan-400">8 Assessments</p>
                <span className="text-xs text-slate-500">3 requiring grading reviews</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Interactive AI Assistance</h4>
                <p className="text-xl font-bold mt-1 text-purple-400">98% Positive Feedback</p>
                <span className="text-xs text-slate-500">Based on student-tutor sessions</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Latest System Check</h4>
                <p className="text-xl font-bold mt-1 text-blue-400">Standard Baseline</p>
                <span className="text-xs text-slate-500">No anomalies reported</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="glassmorphism p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full filter blur-xl" />
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Award className="h-5 w-5 text-rose-400" />
              <span className="text-sm font-bold tracking-wider text-slate-200 uppercase">System Status Console</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Security Protocol</h4>
                <p className="text-xl font-bold mt-1 text-emerald-400">RS256 JWT Signed</p>
                <span className="text-xs text-slate-500">Stateless Cookie Vectors Enabled</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Global Calibration</h4>
                <p className="text-xl font-bold mt-1 text-cyan-400">Index 1.00 Standard</p>
                <span className="text-xs text-slate-500">Calibrated Weightings Balanced</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Data Traffic Nodes</h4>
                <p className="text-xl font-bold mt-1 text-purple-400">5/5 Subsystems Active</p>
                <span className="text-xs text-slate-500">API Gateway Online</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Database Isolation</h4>
                <p className="text-xl font-bold mt-1 text-blue-400">Complete Isolation</p>
                <span className="text-xs text-slate-500">Dynamic credentials stored in localStorage</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
