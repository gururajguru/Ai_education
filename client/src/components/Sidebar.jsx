import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { 
  LayoutDashboard, BookOpen, Bot, Award, Calendar, Users, 
  User, Shield, ChevronLeft, ChevronRight, GraduationCap, Compass
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, collapsed, setCollapsed }) {
  const { user } = useContext(UserContext);

  const getMenuItems = () => {
    const role = user.role || 'Student';
    if (role === 'Teacher') {
      return [
        { id: 'teacherDashboard', name: 'Teacher Console', icon: Shield, color: 'text-rose-400' },
        { id: 'profile', name: 'Faculty Profile', icon: User, color: 'text-indigo-400' }
      ];
    } else if (role === 'Admin') {
      return [
        { id: 'admin', name: 'Admin Toggles', icon: Shield, color: 'text-rose-400' },
        { id: 'profile', name: 'Admin Profile', icon: User, color: 'text-indigo-400' }
      ];
    } else {
      return [
        { id: 'dashboard', name: 'Dashboard Hub', icon: LayoutDashboard, color: 'text-cyan-400' },
        { id: 'courses', name: 'Smart Courses', icon: BookOpen, color: 'text-violet-400' },
        { id: 'tutor', name: 'AI Tutor', icon: Bot, color: 'text-emerald-400' },
        { id: 'quiz', name: 'Smart Quizzes', icon: Award, color: 'text-amber-400' },
        { id: 'planner', name: 'AI Planner', icon: Calendar, color: 'text-rose-400' },
        { id: 'studyrooms', name: 'Study Rooms', icon: Users, color: 'text-pink-400' },
        { id: 'profile', name: 'Profile Hub', icon: User, color: 'text-indigo-400' }
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen glassmorphism-sidebar z-30 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <GraduationCap className="h-8 w-8 text-primaryGlow animate-bounce" />
          {!collapsed && (
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-neonPurple text-lg tracking-wider whitespace-nowrap">
              AI UNIVERSE
            </span>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg glassmorphism-light hover:text-primaryGlow transition-colors duration-200"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Options List */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-r from-neonPurple/20 to-secondaryGlow/20 text-white border-l-4 border-primaryGlow' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
              
              {!collapsed && (
                <span className="font-medium text-sm tracking-wide transition-all duration-200">
                  {item.name}
                </span>
              )}

              {/* Glowing tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-24 bg-[#0a0624] text-xs font-semibold px-3 py-1.5 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-neon-purple z-50">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
