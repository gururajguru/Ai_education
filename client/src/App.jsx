import React, { useState, useContext, useEffect, lazy, Suspense } from 'react';
import { UserProvider, UserContext } from './context/UserContext';
import { LearningProvider } from './context/LearningContext';
import ParticleBackground from './components/ParticleBackground';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Lazy-loaded premium sub-pages for optimal performance and chunk-splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tutor = lazy(() => import('./pages/Tutor'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Courses = lazy(() => import('./pages/Courses'));
const Planner = lazy(() => import('./pages/Planner'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const StudyRoom = lazy(() => import('./components/StudyRoom'));

function LearningUniverseRouter() {
  const [page, setPage] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Route guard: if landing/auth pages, let them proceed
    if (page === 'home' || page === 'login') return;

    const role = user?.role || 'Student';

    if (role === 'Teacher') {
      const allowedPages = ['teacherDashboard', 'profile'];
      if (!allowedPages.includes(page)) {
        setPage('teacherDashboard');
      }
    } else if (role === 'Admin') {
      const allowedPages = ['admin', 'profile'];
      if (!allowedPages.includes(page)) {
        setPage('admin');
      }
    } else {
      // Student
      const allowedPages = ['dashboard', 'courses', 'tutor', 'quiz', 'planner', 'studyrooms', 'profile'];
      if (!allowedPages.includes(page)) {
        setPage('dashboard');
      }
    }
  }, [page, user?.role]);

  // Reset scroll position to top on every page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  const renderActivePage = () => {
    switch (page) {
      case 'home':
        return <Home setPage={setPage} />;
      case 'login':
        return <Login setPage={setPage} />;
      case 'dashboard':
        return <Dashboard setCurrentPage={setPage} />;
      case 'tutor':
        return <Tutor />;
      case 'quiz':
        return <Quiz />;
      case 'courses':
        return <Courses />;
      case 'planner':
        return <Planner />;
      case 'studyrooms':
        return <StudyRoom />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return <Admin />;
      case 'teacherDashboard':
        return <TeacherDashboard />;
      default:
        return <Dashboard setCurrentPage={setPage} />;
    }
  };

  const isPortalActive = page !== 'home' && page !== 'login';

  return (
    <div className="min-h-screen relative text-slate-100 flex">
      {/* Dynamic backdrop particle animation layers */}
      <ParticleBackground />

      {/* Persistent Left Collapsible Sidebar */}
      {isPortalActive && (
        <Sidebar 
          currentPage={page} 
          setCurrentPage={setPage} 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
        />
      )}

      {/* Main Console Hub Layout area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isPortalActive 
            ? sidebarCollapsed ? 'pl-20' : 'pl-64' 
            : 'pl-0'
        }`}
      >
        {/* Persistent Top Navigation Bar */}
        {isPortalActive && (
          <Navbar currentPage={page} setCurrentPage={setPage} />
        )}

        {/* Dynamic Pages viewport */}
        <main className={`flex-1 overflow-x-hidden ${isPortalActive ? 'p-6 md:p-8' : 'p-0'}`}>
          <Suspense fallback={
            <div className="min-h-[50vh] w-full flex flex-col items-center justify-center gap-4 text-center">
              <div className="h-10 w-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest animate-pulse">
                Synchronizing Cosmos...
              </span>
            </div>
          }>
            {renderActivePage()}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <LearningProvider>
        <LearningUniverseRouter />
      </LearningProvider>
    </UserProvider>
  );
}
