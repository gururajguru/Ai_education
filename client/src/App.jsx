import React, { useState, useContext, useEffect } from 'react';
import { UserProvider, UserContext } from './context/UserContext';
import { LearningProvider } from './context/LearningContext';
import ParticleBackground from './components/ParticleBackground';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Import all premium sub-pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tutor from './pages/Tutor';
import Quiz from './pages/Quiz';
import Courses from './pages/Courses';
import Planner from './pages/Planner';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import TeacherDashboard from './pages/TeacherDashboard';
import StudyRoom from './components/StudyRoom';

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
          {renderActivePage()}
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
