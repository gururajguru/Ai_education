import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import confetti from 'canvas-confetti';
import { 
  Bot, Sparkles, Shield, GraduationCap, Flame, ArrowRight, 
  Users, Key, Cpu, Mail, Lock, ShieldCheck, Activity, 
  CheckCircle2, Zap, AlertCircle, Fingerprint, Globe, 
  Database, BookOpen, Terminal 
} from 'lucide-react';

export default function Home({ setPage }) {
  const { setUser, addNotification } = useContext(UserContext);
  
  // Custom JWS simulation state
  const [cryptState, setCryptState] = useState('idle'); // 'idle' | 'generating' | 'encrypted'
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'teacher' | 'admin'

  // Scroll function helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70; // Header offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Cryptographic token encryption delay simulator
  const runCryptoSimulation = () => {
    if (cryptState === 'generating') return;
    
    setCryptState('generating');
    setTimeout(() => {
      setCryptState('encrypted');
      confetti({
        particleCount: 40,
        spread: 30,
        origin: { y: 0.85 },
        colors: ['#00f2fe', '#4facfe', '#8a2be2']
      });
    }, 1200);
  };

  // Instant sandbox authorization bypass
  const handleQuickLogin = (role) => {
    let payload = {};
    if (role === 'student') {
      payload = {
        name: 'Scholar',
        email: 'scholar@universe.ai',
        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=scholar@universe.ai',
        xp: 220,
        level: 1,
        streak: 0,
        learningMode: 'Exam Prep',
        role: 'Student'
      };
    } else if (role === 'teacher') {
      payload = {
        name: 'Vance',
        email: 'vance@faculty.ai',
        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=vance@faculty.ai',
        xp: 0,
        level: 0,
        streak: 0,
        learningMode: 'N/A',
        role: 'Teacher'
      };
    } else if (role === 'admin') {
      payload = {
        name: 'System Admin',
        email: 'operator@system.ai',
        avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=operator@system.ai',
        xp: 0,
        level: 0,
        streak: 0,
        learningMode: 'N/A',
        role: 'Admin'
      };
    }

    // Set User Session instantly
    setUser({
      ...payload,
      badges: [
        { id: '1', title: 'Universe Pioneer', desc: 'Welcome to the Adaptive AI Learning Universe', icon: '🚀', unlocked: true },
        { id: '2', title: 'Streak Master', desc: 'Maintain a 5-day daily study streak', icon: '🔥', unlocked: false },
        { id: '3', title: 'Gemini Scholar', desc: 'Interact with the AI Tutor 10 times', icon: '🧠', unlocked: false },
        { id: '4', title: 'Quiz Master', desc: 'Score a perfect 100% on any quiz', icon: '🏆', unlocked: false },
        { id: '5', title: 'Hyper Focus', desc: 'Maintain focus engagement above 90% for 5 mins', icon: '⚡', unlocked: false },
        { id: '6', title: 'Recall Guru', desc: 'Achieve a cognitive memory retention rate of 95%', icon: '🧘', unlocked: false }
      ],
      completedLessons: [],
      studyTime: payload.xp > 0 ? payload.xp / 2 : 0
    });

    addNotification({
      title: 'Portal Credentials Mounted 🔑',
      message: `Profile active with role: [${payload.role}]. Secure JWT token mounted.`,
      time: 'Just now'
    });

    // Fire success fanfare
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#39ff14', '#00f2fe', '#8a2be2']
    });

    // Navigation dispatch
    if (payload.role === 'Teacher') {
      setPage('teacherDashboard');
    } else if (payload.role === 'Admin') {
      setPage('admin');
    } else {
      setPage('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-slate-100 relative overflow-hidden flex flex-col items-center">
      
      {/* Decorative blurred background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primaryGlow/5 rounded-full filter blur-[150px] animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-neonPurple/5 rounded-full filter blur-[180px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-neonPink/5 rounded-full filter blur-[140px] animate-pulse-glow" style={{ animationDelay: '5s' }} />

      {/* STICKY HEADER NAVIGATION */}
      <header className="sticky top-0 w-full z-50 glassmorphism-sidebar border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="font-extrabold text-sm md:text-base text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-neonPurple tracking-widest uppercase">
            ADAPTIVE LEARNING UNIVERSE
          </span>
        </div>
        
        {/* Navigation Quick Links */}
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('overview')}
            className="text-xs font-black uppercase text-slate-400 hover:text-cyan-400 tracking-wider transition-colors"
          >
            Core Pillars
          </button>
          <button 
            onClick={() => scrollToSection('walkthrough')}
            className="text-xs font-black uppercase text-slate-400 hover:text-cyan-400 tracking-wider transition-colors"
          >
            Portal Blueprint
          </button>
          <button 
            onClick={() => scrollToSection('architecture')}
            className="text-xs font-black uppercase text-slate-400 hover:text-cyan-400 tracking-wider transition-colors"
          >
            System Info
          </button>
          <button 
            onClick={() => scrollToSection('cryptography')}
            className="text-xs font-black uppercase text-slate-400 hover:text-cyan-400 tracking-wider transition-colors"
          >
            JWS Live Lab
          </button>
          <button 
            onClick={() => scrollToSection('credentials')}
            className="text-xs font-black uppercase text-slate-400 hover:text-cyan-400 tracking-wider transition-colors"
          >
            Access Keys
          </button>
        </nav>

        {/* CTA Launch Portal */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPage('login')}
            className="px-4 py-2 bg-gradient-to-r from-primaryGlow to-secondaryGlow text-darkBg font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-neon-cyan/20"
          >
            Sign In Form
          </button>
        </div>
      </header>

      {/* SCROLLABLE MAIN LAYOUT AREA */}
      <div className="max-w-6xl w-full px-6 py-12 md:py-20 flex flex-col gap-24 relative z-10 text-center">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
          {/* Floating tag banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/40 shadow-neon-cyan/20 animate-bounce">
            <Sparkles className="h-4.5 w-4.5 text-cyan-400" />
            <span className="text-[10px] md:text-xs font-black text-cyan-200 tracking-widest uppercase">Next-Generation EdTech Sandbox</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500">
            ADAPTIVE AI<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow via-secondaryGlow to-neonPurple">
              LEARNING PORTAL
            </span>
          </h1>

          <p className="max-w-2xl text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
            Embark on a customized education platform powered by cognitive feedback. The system dynamically adapts difficulty curves, creates real-time study rooms, tracks spacing memory retention decay, and secures roles through signed cryptographic JWT payloads.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <button 
              onClick={() => scrollToSection('credentials')}
              className="px-8 py-4 bg-gradient-to-r from-primaryGlow to-neonPurple rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-neon-cyan hover:opacity-95 hover:scale-[1.02] transition-all flex items-center gap-2 group"
            >
              Get Sandbox Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection('walkthrough')}
              className="px-8 py-4 bg-cyan-950/30 hover:bg-cyan-950/50 text-cyan-300 hover:text-cyan-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-cyan-800/40"
            >
              Explore Walkthrough
            </button>
            <button 
              onClick={() => scrollToSection('cryptography')}
              className="px-8 py-4 glassmorphism rounded-xl text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-white/10"
            >
              Security Validator
            </button>
          </div>
        </section>

        {/* CORE PILLARS SECTION */}
        <section id="overview" className="scroll-mt-24 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
              CORE SYSTEM PILLARS
            </h2>
            <div className="w-16 h-1 bg-cyan-400 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="glassmorphism p-6 rounded-3xl border border-white/5 hover:border-cyan-500/30 hover:neon-glow-cyan transition-all duration-300 group">
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/30 w-fit text-cyan-400 group-hover:scale-105 transition-transform">
                <Bot size={22} />
              </div>
              <h3 className="font-extrabold text-base text-slate-100 mt-5 uppercase tracking-wide">
                Gemini Cognitive Tutor
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                Summarize, outline, or explain complex ideas immediately. Calibrate pedagogical speed and styles on the fly using our adaptive learning modes (Exam Prep, Focus, Revision, Visual).
              </p>
            </div>

            <div className="glassmorphism p-6 rounded-3xl border border-white/5 hover:border-purple-500/30 hover:neon-glow-purple transition-all duration-300 group">
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/30 w-fit text-neonPurple group-hover:scale-105 transition-transform">
                <Activity size={22} />
              </div>
              <h3 className="font-extrabold text-base text-slate-100 mt-5 uppercase tracking-wide">
                Memory Diagnostics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                Analyze attention spans, engagement indices, and knowledge decay curves to tailor test frequencies, dynamic syllabus routes, and custom planners.
              </p>
            </div>

            <div className="glassmorphism p-6 rounded-3xl border border-white/5 hover:border-pink-500/30 hover:neon-glow-pink transition-all duration-300 group">
              <div className="p-3.5 rounded-2xl bg-pink-950/40 border border-pink-800/30 w-fit text-neonPink group-hover:scale-105 transition-transform">
                <Flame size={22} />
              </div>
              <h3 className="font-extrabold text-base text-slate-100 mt-5 uppercase tracking-wide">
                Gamified Spaced Curriculum
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                Earn XP points, unlock custom badges (Gemini Scholar, Peak Focus), maintain active streaks (with 1-day streak activation), and connect to classrooms instantly.
              </p>
            </div>
          </div>
        </section>

        {/* MULTI-PORTAL BLUEPRINT WALKTHROUGH */}
        <section id="walkthrough" className="scroll-mt-24 space-y-12">
          <div className="text-center space-y-2">
            <div className="text-xs font-black tracking-widest text-cyan-400 uppercase">Interactive Walkthrough</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
              PORTAL CAPABILITIES BLUEPRINT
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Our secure educational ecosystem maintains zero mixing between user levels. Discover our custom dashboard layers built for Students, Educators, and Admins:
            </p>
            <div className="w-16 h-1 bg-cyan-400 mx-auto rounded-full mt-2" />
          </div>

          {/* Three side-by-side portal maps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            
            {/* Student Portal Card */}
            <div className="glassmorphism p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full filter blur-xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-800/30 text-cyan-400">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base text-slate-100 uppercase tracking-wider">
                      STUDENT DASHBOARD
                    </h3>
                    <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Adaptive Curriculum</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Engage in personalized gamified courses integrated with spaces-repetition analytics:
                </p>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-black mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-100 uppercase text-[10px] tracking-wider block">Streak Calibration</strong>
                      Fresh student sessions mount at 0. Start a 1-day study streak banner to activate and earn a +50 XP bonus with visual fireworks!
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-black mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-100 uppercase text-[10px] tracking-wider block">Classroom Connection</strong>
                      Quick-connect via class codes (e.g. <span className="font-mono text-cyan-300 bg-cyan-950/40 px-1 py-0.5 rounded border border-cyan-800/30">VANCE-101</span>). Displays dynamic course badges and synced class info.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-black mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-100 uppercase text-[10px] tracking-wider block">AI Tutor Dialogs</strong>
                      Interactive conversational sandbox supporting speeds like "Exam Prep" and "Revision" modes to refine focus metrics.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button 
                  onClick={() => handleQuickLogin('student')}
                  className="w-full py-2.5 bg-cyan-950/50 hover:bg-cyan-950/80 text-cyan-300 rounded-xl text-xs font-black uppercase tracking-wider border border-cyan-800/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-neon-cyan/5"
                >
                  Mount Student Sandbox <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Educator Portal Card */}
            <div className="glassmorphism p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-800/30 text-neonPurple">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base text-slate-100 uppercase tracking-wider">
                      EDUCATOR CONSOLE
                    </h3>
                    <span className="text-[10px] text-neonPurple font-mono tracking-widest uppercase">Classroom Manager</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Grants teachers classroom supervision toolsets to grade, announce, and manage:
                </p>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-neonPurple font-black mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-100 uppercase text-[10px] tracking-wider block">Credentials Generator</strong>
                      Add students on the fly! Creates a random, cryptographically robust default password automatically verified against central databases.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neonPurple font-black mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-100 uppercase text-[10px] tracking-wider block">Assignment Dispatcher</strong>
                      Create and broadcast custom study metrics, syllabi modifications, and dynamic grades tracking.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neonPurple font-black mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-100 uppercase text-[10px] tracking-wider block">Bulletin Announcements</strong>
                      Push critical study-hall alerts or notifications straight to student dashboard sidebars.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button 
                  onClick={() => handleQuickLogin('teacher')}
                  className="w-full py-2.5 bg-purple-950/50 hover:bg-purple-950/80 text-purple-300 rounded-xl text-xs font-black uppercase tracking-wider border border-purple-800/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-neon-purple/5"
                >
                  Mount Educator Sandbox <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Administrator Portal Card */}
            <div className="glassmorphism p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-pink-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full filter blur-xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-pink-950/50 border border-pink-800/30 text-neonPink">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base text-slate-100 uppercase tracking-wider">
                      ADMINISTRATOR TERMINAL
                    </h3>
                    <span className="text-[10px] text-neonPink font-mono tracking-widest uppercase">System Core Control</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Supervise security, database storage state limits, and cryptographic signatures:
                </p>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-neonPink font-black mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-100 uppercase text-[10px] tracking-wider block">Decryption Terminal</strong>
                      A diagnostic visualizer breaking down raw Base64 JWS components (Header, Payload, Signature) on current active sessions.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neonPink font-black mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-100 uppercase text-[10px] tracking-wider block">Health Panel Indicators</strong>
                      Toggle dynamic system subsystems (AI tutors, DB sync, security triggers) to calibrate portal load parameters.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neonPink font-black mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-100 uppercase text-[10px] tracking-wider block">Stateless Authority Routing</strong>
                      Enforces absolute session isolation by intercepting client-side router hooks via cryptographically verified roles.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button 
                  onClick={() => handleQuickLogin('admin')}
                  className="w-full py-2.5 bg-pink-950/50 hover:bg-pink-950/80 text-pink-300 rounded-xl text-xs font-black uppercase tracking-wider border border-pink-800/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-neon-pink/5"
                >
                  Mount Administrator Terminal <ArrowRight size={12} />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS TIMELINE */}
        <section id="architecture" className="scroll-mt-24 space-y-12">
          <div className="text-center space-y-2">
            <div className="text-xs font-black tracking-widest text-cyan-400 uppercase">Under the Hood</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
              HOW THE WEBSITE WORKS
            </h2>
            <div className="w-16 h-1 bg-cyan-400 mx-auto rounded-full mt-2" />
          </div>

          {/* Interactive Timeline Columns */}
          <div className="relative border-l border-white/10 ml-4 md:ml-12 text-left space-y-12">
            
            {/* Step 1 */}
            <div className="relative pl-8 md:pl-12 group">
              {/* Timeline dot */}
              <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-cyan-400 border border-darkBg shadow-neon-cyan group-hover:scale-110 transition-transform" />
              
              <div className="glassmorphism p-5 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all max-w-4xl">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold mb-1">
                  Phase 01 • Cognitive Diagnostics
                </span>
                <h4 className="font-extrabold text-sm md:text-base text-slate-100 uppercase tracking-wide flex items-center gap-2">
                  <Activity size={16} className="text-cyan-400" /> Profiling & Skill Calibration
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Upon your initial login, the platform sets up a personal cognitive database tracking memory retention indices (base 82%) and focus meters. When completing lesson tasks or taking dynamic quizzes, standard spaced-repetition algorithms recalculate subject gaps, offering automated syllabus routes.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative pl-8 md:pl-12 group">
              {/* Timeline dot */}
              <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-purple-500 border border-darkBg shadow-neon-purple group-hover:scale-110 transition-transform" />
              
              <div className="glassmorphism p-5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all max-w-4xl">
                <span className="text-[10px] font-mono text-neonPurple uppercase tracking-widest block font-bold mb-1">
                  Phase 02 • Cryptographic Security
                </span>
                <h4 className="font-extrabold text-sm md:text-base text-slate-100 uppercase tracking-wide flex items-center gap-2">
                  <Key size={16} className="text-neonPurple" /> Signed Session JWT Packaging
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  To achieve absolute, hackathon-grade protection, user profile metrics are serialized inside an encrypted **JSON Web Signature (JWS)** vector. Each role has signature parameters verified by browser SHA-256 live hashing algorithms. Administrators inspect raw JWT headers, claims payloads, and signature public key digests before sessions mounting.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative pl-8 md:pl-12 group">
              {/* Timeline dot */}
              <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-pink-500 border border-darkBg shadow-neon-pink group-hover:scale-110 transition-transform" />
              
              <div className="glassmorphism p-5 rounded-2xl border border-white/5 hover:border-pink-500/20 transition-all max-w-4xl">
                <span className="text-[10px] font-mono text-neonPink uppercase tracking-widest block font-bold mb-1">
                  Phase 03 • Adaptive LLM Tutoring
                </span>
                <h4 className="font-extrabold text-sm md:text-base text-slate-100 uppercase tracking-wide flex items-center gap-2">
                  <Bot size={16} className="text-neonPink" /> Real-time Gemini Pedagogy
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  In the Student classroom space, an advanced Gemini cognitive tutor operates side-by-side with your planner. Using responsive context injections, the chatbot tunes its teaching velocity (from simplified beginner explanations to fast summary cards) ensuring that student study streaks translate into genuine mastery.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECURITY & CRYPTOGRAPHY SIMULATOR */}
        <section id="cryptography" className="scroll-mt-24 space-y-12">
          <div className="text-center space-y-2">
            <div className="text-xs font-black tracking-widest text-cyan-400 uppercase">Live Tech Demonstration</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
              JWS SECURITY VALIDATOR LAB
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Simulate how our cryptographic auth gateway signs student credentials. Press the button to run the live SHA-256 certificate handshake:
            </p>
            <div className="w-16 h-1 bg-cyan-400 mx-auto rounded-full mt-2" />
          </div>

          <div className="glassmorphism p-6 md:p-8 rounded-3xl border border-white/10 text-left max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-cyan-500/20">
              <Terminal size={60} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
              <div>
                <h3 className="font-extrabold text-sm md:text-base text-slate-100 uppercase tracking-wide flex items-center gap-2">
                  <Fingerprint className="text-cyan-400 animate-pulse" size={18} /> MOCK JWS HANDSHAKE CONSOLE
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Dual-Key Validation Specification (RS256)</p>
              </div>

              <button
                disabled={cryptState === 'generating'}
                onClick={runCryptoSimulation}
                className="py-2 px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-455 hover:to-blue-555 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-neon-cyan disabled:opacity-50 transition-all"
              >
                {cryptState === 'idle' && 'Generate Signed Token'}
                {cryptState === 'generating' && 'Computing SHA-256 digest...'}
                {cryptState === 'encrypted' && 'Regenerate Signed Token'}
              </button>
            </div>

            {/* Simulated Cryptographic Readout */}
            <div className="mt-6 space-y-4 font-mono text-xs">
              {cryptState === 'idle' && (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Activity className="mx-auto text-slate-600 animate-pulse" size={24} />
                  <p>Console Idle. Click "Generate Signed Token" above to begin encryption.</p>
                </div>
              )}

              {cryptState === 'generating' && (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="h-8 w-8 border-t-2 border-cyan-400 border-r-2 border-r-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 animate-pulse text-[10px] tracking-widest uppercase font-bold">Encrypting header + payload hashes...</p>
                </div>
              )}

              {cryptState === 'encrypted' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  
                  {/* Header part */}
                  <div className="space-y-1">
                    <span className="text-rose-400 font-extrabold text-[10px] tracking-widest block uppercase">JWS HEADER (RS256 SPEC)</span>
                    <pre className="p-3 bg-rose-950/20 border border-rose-900/30 text-rose-300 rounded-xl leading-relaxed">
{`{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "cosmos-key-node-42"
}`}
                    </pre>
                  </div>

                  {/* Payload part */}
                  <div className="space-y-1">
                    <span className="text-cyan-400 font-extrabold text-[10px] tracking-widest block uppercase">DECRYPTED PAYLOAD (STUDENT CONTEXT)</span>
                    <pre className="p-3 bg-cyan-950/20 border border-cyan-900/30 text-cyan-300 rounded-xl leading-relaxed">
{`{
  "sub": "scholar@universe.ai",
  "name": "Scholar",
  "role": "Student",
  "xp": 220,
  "level": 1,
  "streak": 0,
  "learningMode": "Exam Prep",
  "iss": "adaptive-learning-universe-gateway",
  "iat": ${Math.floor(Date.now() / 1000)}
}`}
                    </pre>
                  </div>

                  {/* Signature part */}
                  <div className="space-y-1">
                    <span className="text-purple-400 font-extrabold text-[10px] tracking-widest block uppercase">VERIFIED SECURE SIGNATURE</span>
                    <pre className="p-3 bg-purple-950/20 border border-purple-900/30 text-purple-300 rounded-xl leading-normal break-all">
RSASHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  "COSMIC-HMAC-256-SECRET-SEED-KEY-NODE-42"
) ➡️ Valid Signature Verified
                    </pre>
                  </div>

                  <div className="p-2 bg-emerald-950/25 border border-emerald-900/30 rounded-xl text-emerald-400 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={12} className="animate-pulse" /> Cryptographic Integrity Intact. Signature is 100% Valid.
                  </div>

                </div>
              )}
            </div>
          </div>
        </section>

        {/* SANDBOX CREDENTIALS & INSTANT QUICK-LOGIN HUB */}
        <section id="credentials" className="scroll-mt-24 space-y-12">
          <div className="text-center space-y-2">
            <div className="text-xs font-black tracking-widest text-cyan-400 uppercase font-mono">Academic Sandbox Hub</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
              ACADEMIC SANDBOX ACCESS KEYS
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Test different user privileges without manual form filing! Use the cards below to inspect pre-configured roles or click **"Instant Quick Login"** to jump straight into their consoles:
            </p>
            <div className="w-16 h-1 bg-cyan-400 mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Student Credential */}
            <div className="glassmorphism p-6 rounded-3xl border border-cyan-800/20 relative group hover:border-cyan-500/40 hover:neon-glow-cyan transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                    🎓 Student
                  </span>
                  <div className="h-6 w-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <GraduationCap size={12} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">User ID (Email)</span>
                    <span className="text-xs font-mono text-slate-200 select-all block bg-black/40 p-2 rounded-lg border border-white/5">
                      scholar@universe.ai
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Security Password</span>
                    <span className="text-xs font-mono text-slate-200 select-all block bg-black/40 p-2 rounded-lg border border-white/5">
                      CosmicScholar2026!
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  onClick={() => handleQuickLogin('student')}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-neon-cyan transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap size={12} className="animate-pulse" /> Instant Student Login
                </button>
              </div>
            </div>

            {/* Educator Credential */}
            <div className="glassmorphism p-6 rounded-3xl border border-purple-800/20 relative group hover:border-purple-500/40 hover:neon-glow-purple transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300">
                    👨‍🏫 Teacher
                  </span>
                  <div className="h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center text-neonPurple">
                    <Users size={12} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">User ID (Email)</span>
                    <span className="text-xs font-mono text-slate-200 select-all block bg-black/40 p-2 rounded-lg border border-white/5">
                      vance@faculty.ai
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Security Password</span>
                    <span className="text-xs font-mono text-slate-200 select-all block bg-black/40 p-2 rounded-lg border border-white/5">
                      FacultyKeynote99!
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  onClick={() => handleQuickLogin('teacher')}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-neon-purple transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap size={12} className="animate-pulse" /> Instant Teacher Login
                </button>
              </div>
            </div>

            {/* Admin Credential */}
            <div className="glassmorphism p-6 rounded-3xl border border-rose-800/20 relative group hover:border-rose-500/40 hover:neon-glow-pink transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/30 text-rose-300">
                    🛠️ Administrator
                  </span>
                  <div className="h-6 w-6 rounded-full bg-rose-500/10 flex items-center justify-center text-neonPink">
                    <Shield size={12} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">User ID (Email)</span>
                    <span className="text-xs font-mono text-slate-200 select-all block bg-black/40 p-2 rounded-lg border border-white/5">
                      operator@system.ai
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Security Password</span>
                    <span className="text-xs font-mono text-slate-200 select-all block bg-black/40 p-2 rounded-lg border border-white/5">
                      RootTerminalOverride#
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  onClick={() => handleQuickLogin('admin')}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:scale-[1.02] active:scale-[0.98] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-neon-pink transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap size={12} className="animate-pulse" /> Instant Admin Login
                </button>
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* FOOTER BRAND DETAILS */}
      <footer className="w-full py-8 mt-24 glassmorphism-sidebar border-t border-white/5 text-center relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <GraduationCap size={14} /> Powered by Gemini LLM • Vite • Tailwind • Framer
          </div>
          <div>
            © 2026 Adaptive AI learning Universe • Secured via JWS
          </div>
        </div>
      </footer>

    </div>
  );
}
