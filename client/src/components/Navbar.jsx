import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Bell, Flame, Sparkles, LogOut, CheckSquare, GraduationCap } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const {
    user, 
    notifications, 
    changeLearningMode, 
    markAllNotificationsRead, 
    clearNotifications 
  } = useContext(UserContext);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const modeColors = {
    'Beginner': 'from-cyan-500 to-blue-600 shadow-neon-cyan',
    'Fast Learner': 'from-amber-400 to-rose-500 shadow-neon-pink',
    'Exam Prep': 'from-red-500 to-purple-600 shadow-neon-purple',
    'Revision': 'from-emerald-400 to-cyan-500 shadow-neon-green',
    'Visual Learning': 'from-indigo-500 to-pink-500 shadow-neon-purple'
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <header className="h-20 w-full glassmorphism border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20 backdrop-blur-md">
      
      {/* Dynamic Hub Header */}
      <div>
        <h1 className="text-xl font-bold font-sans tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 capitalize">
          {currentPage.replace(/([A-Z])/g, ' $1')}
        </h1>
        <p className="text-xs text-slate-400 hidden md:block">
          Learning Management System
        </p>
      </div>

      {/* Control Console */}
      <div className="flex items-center gap-5 md:gap-7">
        
        {/* If student, show gamification and study modes */}
        {user?.role === 'Student' && (
          <>
            {/* AI Learning Mode Switch Selector */}
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400 hidden sm:block animate-pulse" />
              <select 
                value={user.learningMode}
                onChange={(e) => changeLearningMode(e.target.value)}
                className="bg-black/60 border border-white/10 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-primaryGlow text-white tracking-wide cursor-pointer transition-all duration-300"
              >
                <option value="Beginner">👶 Beginner Mode</option>
                <option value="Fast Learner">⚡ Fast Learner Mode</option>
                <option value="Exam Prep">📝 Exam Prep Mode</option>
                <option value="Revision">🔄 Revision Mode</option>
                <option value="Visual Learning">🎨 Visual Learning</option>
              </select>
            </div>

            {/* Dynamic Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-950/40 border border-orange-900/50 shadow-neon-pink group cursor-pointer hover:scale-105 transition-transform duration-200">
              <Flame className="h-4 w-4 text-orange-400 group-hover:scale-125 transition-transform duration-200 animate-pulse" />
              <span className="text-xs font-extrabold text-orange-200 tracking-wider">
                {user.streak} DAY STREAK
              </span>
            </div>

            {/* Level & XP Gauge */}
            <div className="hidden lg:flex flex-col w-36 gap-1">
              <div className="flex justify-between text-xs font-extrabold text-slate-400 tracking-wider">
                <span>LEVEL {user.level}</span>
                <span>{user.xp % 500} / 500 XP</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-primaryGlow to-neonPurple transition-all duration-500"
                  style={{ width: `${((user.xp % 500) / 500) * 100}%` }}
                />
              </div>
            </div>
          </>
        )}

        {/* If Teacher or Admin, show professional role badge */}
        {user?.role !== 'Student' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-950/40 border border-indigo-900/50 shadow-sm">
            <GraduationCap className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-200 tracking-wider uppercase">
              {user?.role} Portal
            </span>
          </div>
        )}

        {/* Notification Bell Center */}
        <div className="relative">
          <button 
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="p-2 rounded-lg glassmorphism-light hover:text-primaryGlow hover:border-primaryGlow/30 transition-all duration-200 relative"
          >
            <Bell size={18} className="text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 glassmorphism rounded-2xl p-4 shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-bold text-sm tracking-wide text-white">Notifications</span>
                <div className="flex gap-2">
                  <button 
                    onClick={markAllNotificationsRead}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-0.5"
                  >
                    <CheckSquare size={10} /> Mark all read
                  </button>
                  <button 
                    onClick={clearNotifications}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto mt-2 space-y-2.5">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No new notifications.</p>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-2.5 rounded-lg border transition-colors duration-200 ${
                        notif.read ? 'bg-white/0 border-transparent text-slate-400' : 'bg-white/5 border-white/5 text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold text-xs">{notif.title}</span>
                        <span className="text-xs text-slate-500 whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-xs mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Console */}
        <div className="relative">
          <button 
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 hover:border-primaryGlow/40 transition-colors duration-200 focus:outline-none"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-8 w-8 rounded-full object-cover border border-white/15" 
            />
          </button>

          {/* Profile Dropdown Options */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 glassmorphism rounded-2xl p-3 shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-2 py-1.5 border-b border-white/15 mb-2">
                <p className="font-bold text-xs text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
              <button 
                onClick={() => { setCurrentPage('profile'); setProfileOpen(false); }}
                className="w-full text-left px-2 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 text-slate-200 hover:text-white transition-colors duration-150"
              >
                👤 View Profile Hub
              </button>
              <button 
                onClick={() => { 
                  if (user?.role === 'Teacher') {
                    setCurrentPage('teacherDashboard');
                  } else if (user?.role === 'Admin') {
                    setCurrentPage('admin');
                  } else {
                    setCurrentPage('dashboard');
                  }
                  setProfileOpen(false); 
                }}
                className="w-full text-left px-2 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 text-slate-200 hover:text-white transition-colors duration-150"
              >
                📊 {user?.role === 'Student' ? 'Student Dashboard' : user?.role === 'Teacher' ? 'Teacher Dashboard' : 'Admin Control Panel'}
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-2 py-2 rounded-lg text-xs font-semibold hover:bg-rose-950/20 text-rose-400 hover:text-rose-200 flex items-center gap-1.5 transition-colors duration-150 border-t border-white/5 mt-2"
              >
                <LogOut size={12} /> Log Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
